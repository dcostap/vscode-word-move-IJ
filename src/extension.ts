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

        const char = document.getText(new vscode.Range(position, position.translate(0, 0)));
        vscode.window.showInformationMessage('Whitespace detected: ' + char);
        return /\s/.test(char);
    }

    // Scan through whitespace to the left and return the new position
    function scanLeftThroughWhitespace(document: vscode.TextDocument, position: vscode.Position): vscode.Position {
        let currentPosition = position;
        let prevPosition: vscode.Position;

        while (true) {
            if (currentPosition.character === 0) {
                // At beginning of line, can't go further left on this line
                if (currentPosition.line <= 0) {
                    return currentPosition; // At document start
                }
                // Move to end of previous line
                const prevLine = document.lineAt(currentPosition.line - 1);
                prevPosition = new vscode.Position(currentPosition.line - 1, prevLine.text.length);
            } else {
                prevPosition = currentPosition.translate(0, -1);
            }

            if (!isWhitespace(document, prevPosition)) {
                return currentPosition;
            }
            currentPosition = prevPosition;
        }
    }

    // Scan through whitespace to the right and return the new position
    function scanRightThroughWhitespace(document: vscode.TextDocument, position: vscode.Position): vscode.Position {
        let currentPosition = position;
        let nextPosition: vscode.Position;

        while (true) {
            const currentLine = document.lineAt(currentPosition.line);
            if (currentPosition.character >= currentLine.text.length) {
                // At end of line, can't go further right on this line
                if (currentPosition.line >= document.lineCount - 1) {
                    return currentPosition; // At document end
                }
                // Move to start of next line
                nextPosition = new vscode.Position(currentPosition.line + 1, 0);
            } else {
                nextPosition = currentPosition.translate(0, 1);
            }

            if (!isWhitespace(document, nextPosition)) {
                return nextPosition;
            }
            currentPosition = nextPosition;
        }
    }

    // Move cursor word start left command (Ctrl+Left)
    context.subscriptions.push(vscode.commands.registerCommand('wordmoveij.cursorWordStartLeft', () => {

    }));

    // Move cursor word end right command (Ctrl+Right)
    context.subscriptions.push(vscode.commands.registerCommand('wordmoveij.cursorWordEndRight', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const document = editor.document;
        const position = editor.selection.active;
        
        // If we're at the end of the document, do nothing
        const lastLine = document.lineAt(document.lineCount - 1);
        if (position.line === lastLine.lineNumber && position.character === lastLine.text.length) return;

        // Check the character to the right
        let nextPosition: vscode.Position;
        const currentLine = document.lineAt(position.line);
        if (position.character >= currentLine.text.length) {
            // We're at the end of a line, move to the beginning of the next line
            if (position.line >= document.lineCount - 1) return;
            nextPosition = new vscode.Position(position.line + 1, 0);
        } else {
            nextPosition = position.translate(0, 1);
        }

        // Handle whitespace specially
        if (isWhitespace(document, nextPosition)) {
            vscode.window.showInformationMessage('Whitespace detected, moving cursor right');
            const newPosition = scanRightThroughWhitespace(document, position);
            
            // If we hit a newline, use default word movement
            if (newPosition.line !== position.line) {
                vscode.commands.executeCommand('cursorRight');
                return;
            }
            
            // Otherwise move to the new position
            editor.selection = new vscode.Selection(newPosition, newPosition);
            return;
        }

        // If the next character is a word separator, move cursor right by one
        if (isWordSeparator(document, position)) {
            // debug notify in popup
            vscode.window.showInformationMessage('Word separator detected, moving cursor right');
            vscode.commands.executeCommand('cursorRight');
        } else {
            vscode.window.showInformationMessage('detected: ' + document.getText(new vscode.Range(position, nextPosition)));
            vscode.commands.executeCommand('cursorWordEndRight');
        }
    }));

    // Select word start left command (Ctrl+Shift+Left)
    context.subscriptions.push(vscode.commands.registerCommand('wordmoveij.cursorWordStartLeftSelect', () => {

    }));

    // Select word end right command (Ctrl+Shift+Right)
    context.subscriptions.push(vscode.commands.registerCommand('wordmoveij.cursorWordEndRightSelect', () => {

    }));
}

export function deactivate() {}
