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

    // Move cursor word start left command (Ctrl+Left)
    context.subscriptions.push(vscode.commands.registerCommand('wordmoveij.cursorWordStartLeft', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const document = editor.document;
        const position = editor.selection.active;

        // If we're at the beginning of the document, do nothing
        if (position.line === 0 && position.character === 0) return;

        // Check the character to the left
        let prevPosition: vscode.Position;
        if (position.character === 0) {
            // We're at the beginning of a line, move to the end of the previous line
            if (position.line <= 0) return;
            const prevLine = document.lineAt(position.line - 1);
            prevPosition = new vscode.Position(position.line - 1, prevLine.text.length);
        } else {
            prevPosition = position.translate(0, -1);
        }

        // If the previous character is a word separator, move cursor left by one
        if (isWordSeparator(document, prevPosition)) {
            vscode.commands.executeCommand('cursorLeft');
        } else {
            vscode.commands.executeCommand('cursorWordStartLeft');
        }
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

        // If the next character is a word separator, move cursor right by one
        if (isWordSeparator(document, position)) {
            vscode.commands.executeCommand('cursorRight');
        } else {
            vscode.commands.executeCommand('cursorWordEndRight');
        }
    }));

    // Select word start left command (Ctrl+Shift+Left)
    context.subscriptions.push(vscode.commands.registerCommand('wordmoveij.cursorWordStartLeftSelect', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const document = editor.document;
        const position = editor.selection.active;

        // If we're at the beginning of the document, do nothing
        if (position.line === 0 && position.character === 0) return;

        // Check the character to the left
        let prevPosition: vscode.Position;
        if (position.character === 0) {
            // We're at the beginning of a line, move to the end of the previous line
            if (position.line <= 0) return;
            const prevLine = document.lineAt(position.line - 1);
            prevPosition = new vscode.Position(position.line - 1, prevLine.text.length);
        } else {
            prevPosition = position.translate(0, -1);
        }

        // If the previous character is a word separator, move cursor left by one with selection
        if (isWordSeparator(document, prevPosition)) {
            vscode.commands.executeCommand('cursorLeftSelect');
        } else {
            vscode.commands.executeCommand('cursorWordStartLeftSelect');
        }
    }));

    // Select word end right command (Ctrl+Shift+Right)
    context.subscriptions.push(vscode.commands.registerCommand('wordmoveij.cursorWordEndRightSelect', () => {
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

        // If the next character is a word separator, move cursor right by one with selection
        if (isWordSeparator(document, position)) {
            vscode.commands.executeCommand('cursorRightSelect');
        } else {
            vscode.commands.executeCommand('cursorWordEndRightSelect');
        }
    }));
}

export function deactivate() {}
