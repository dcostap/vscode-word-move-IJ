import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('WordMoveIJ is now active!');

    // Get the word separators from VS Code configuration
    function getWordSeparators(): string {
        return vscode.workspace.getConfiguration('editor').get<string>('wordSeparators') || 
               '`~!@#$%^&*()-=+[{]}\\|;:\'",.<>/?';
    }

    // Check if the character at the given position is a word separator
    function isWordSeparator(document: vscode.TextDocument, position: vscode.Position): boolean {
        if (position.character < 0 || position.line < 0 || 
            position.line >= document.lineCount || 
            position.character >= document.lineAt(position.line).text.length) {
            return false;
        }

        const separators = getWordSeparators();
        const char = document.getText(new vscode.Range(position, position.translate(0, 1)));
        return separators.includes(char);
    }

    // Check if the character at the given position is whitespace
    function isWhitespace(document: vscode.TextDocument, position: vscode.Position): boolean {
        if (position.character < 0 || position.line < 0 || 
            position.line >= document.lineCount || 
            position.character >= document.lineAt(position.line).text.length) {
            return false;
        }

        const char = document.getText(new vscode.Range(position, position.translate(0, 1)));
        return /\s/.test(char);
    }

    // Get the position to the left or right of the current position
    function getAdjacentPosition(document: vscode.TextDocument, position: vscode.Position, moveRight: boolean): vscode.Position | null {
        if (moveRight) {
            const currentLine = document.lineAt(position.line);
            if (position.character >= currentLine.text.length) {
                // At end of line, can't go further right on this line
                if (position.line >= document.lineCount - 1) {
                    return null; // At document end
                }
                // Move to start of next line
                return new vscode.Position(position.line + 1, 0);
            } else {
                return position.translate(0, 1);
            }
        } else {
            if (position.character <= 0) {
                // At start of line, can't go further left on this line
                if (position.line <= 0) {
                    return null; // At document start
                }
                // Move to end of previous line
                const prevLine = document.lineAt(position.line - 1);
                return new vscode.Position(position.line - 1, prevLine.text.length);
            } else {
                return position.translate(0, -1);
            }
        }
    }

    // Scan through whitespace in specified direction and return the new position
    function scanThroughWhitespace(document: vscode.TextDocument, position: vscode.Position, moveRight: boolean): vscode.Position {
        let currentPosition = position;
        let adjacentPosition: vscode.Position | null;

        while (true) {
            adjacentPosition = getAdjacentPosition(document, currentPosition, moveRight);
            if (!adjacentPosition) {
                return currentPosition; // Can't move further
            }

            if (!isWhitespace(document, adjacentPosition)) {
                return moveRight ? adjacentPosition : currentPosition;
            }
            currentPosition = adjacentPosition;
        }
    }

    // Handle cursor movement in either direction, with or without selection
    function handleCursorMovement(moveRight: boolean, select: boolean) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const document = editor.document;
        const position = editor.selection.active;
        
        // Check if we're at document boundary
        if (moveRight) {
            const lastLine = document.lineAt(document.lineCount - 1);
            if (position.line === lastLine.lineNumber && position.character === lastLine.text.length) return;
        } else {
            if (position.line === 0 && position.character === 0) return;
        }

        // Handle line boundary crossings
        // When moving left from beginning of line, go to end of previous line
        if (!moveRight && position.character === 0 && position.line > 0) {
            const prevLine = document.lineAt(position.line - 1);
            const newPosition = new vscode.Position(position.line - 1, prevLine.text.length);
            
            if (select) {
                const anchor = editor.selection.anchor;
                editor.selection = new vscode.Selection(anchor, newPosition);
            } else {
                editor.selection = new vscode.Selection(newPosition, newPosition);
            }
            return;
        }
        
        // When moving right from end of line, go to beginning of next line
        if (moveRight) {
            const currentLine = document.lineAt(position.line);
            if (position.character === currentLine.text.length && position.line < document.lineCount - 1) {
                const newPosition = new vscode.Position(position.line + 1, 0);
                
                if (select) {
                    const anchor = editor.selection.anchor;
                    editor.selection = new vscode.Selection(anchor, newPosition);
                } else {
                    editor.selection = new vscode.Selection(newPosition, newPosition);
                }
                return;
            }
        }

        // Position to check (current for right, previous for left)
        const checkPosition = moveRight ? position : getAdjacentPosition(document, position, false);
        if (!checkPosition) return;

        // Handle whitespace
        if (isWhitespace(document, checkPosition)) {
            const newPosition = scanThroughWhitespace(document, position, moveRight);
            
            // Move to the new position
            if (select) {
                const anchor = editor.selection.anchor;
                editor.selection = new vscode.Selection(anchor, newPosition);
            } else {
                editor.selection = new vscode.Selection(newPosition, newPosition);
            }
            return;
        }

        // Handle word separators vs. regular words
        if (isWordSeparator(document, checkPosition)) {
            // Just move one character in the appropriate direction
            const command = moveRight ? 
                (select ? 'cursorRightSelect' : 'cursorRight') : 
                (select ? 'cursorLeftSelect' : 'cursorLeft');
            vscode.commands.executeCommand(command);
        } else {
            // Use VS Code's word navigation
            const command = moveRight ? 
                (select ? 'cursorWordEndRightSelect' : 'cursorWordEndRight') : 
                (select ? 'cursorWordStartLeftSelect' : 'cursorWordStartLeft');
            vscode.commands.executeCommand(command);
        }
    }

    // Move cursor word start left command (Ctrl+Left)
    context.subscriptions.push(vscode.commands.registerCommand('wordmoveij.cursorWordStartLeft', () => {
        handleCursorMovement(false, false);
    }));

    // Move cursor word end right command (Ctrl+Right)
    context.subscriptions.push(vscode.commands.registerCommand('wordmoveij.cursorWordEndRight', () => {
        handleCursorMovement(true, false);
    }));

    // Select word start left command (Ctrl+Shift+Left)
    context.subscriptions.push(vscode.commands.registerCommand('wordmoveij.cursorWordStartLeftSelect', () => {
        handleCursorMovement(false, true);
    }));

    // Select word end right command (Ctrl+Shift+Right)
    context.subscriptions.push(vscode.commands.registerCommand('wordmoveij.cursorWordEndRightSelect', () => {
        handleCursorMovement(true, true);
    }));
}

export function deactivate() {}
