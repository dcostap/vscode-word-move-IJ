# WordMoveIJ - JetBrains Style Word Movement in VS Code

This extension modifies VS Code's word movement behavior to match JetBrains IDEs.

## Features

WordMoveIJ changes how cursor movement works when using word navigation commands (Ctrl+Left, Ctrl+Right, Ctrl+Shift+Left, Ctrl+Shift+Right). In standard VS Code, word separators are often skipped over when navigating by word. This extension makes VS Code treat individual word separators as single-character "words" - matching the behavior found in JetBrains IDEs.

### Key Differences

- When you encounter a word separator (like punctuation), the cursor will stop at each individual character
- Multiple consecutive separators are navigated one at a time, rather than being skipped

## How to Use

The extension provides four commands, mapped to `ctrl + left`, `ctrl + shift + left`, etc (thus overriding the default ones in VS Code):

- `wordmoveij.cursorWordStartLeft` (replaces `cursorWordStartLeft`)
- `wordmoveij.cursorWordEndRight` (replaces `cursorWordEndRight`)
- `wordmoveij.cursorWordStartLeftSelect` (replaces `cursorWordStartLeftSelect`)
- `wordmoveij.cursorWordEndRightSelect` (replaces `cursorWordEndRightSelect`)

You can customize which characters are considered word separators by modifying the Vs Code built-in `editor.wordSeparators` setting in your preferences.

## Installation

I made this extension for myself, so I didn't bother publishing it.

### Installation from VSIX file

1. Create the VSIX package:
   ```bash
   npm install
   npm run vscode:prepublish
   npx vsce package
   ```

2. Install the extension:
   - In VS Code: `Extensions → ⋯ → Install from VSIX...` and select the generated `.vsix` file
   - Or from command line: `code --install-extension wordmoveij-0.0.1.vsix`

### On a new PC

1. Clone this repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/wordmoveij.git
   cd wordmoveij
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Follow the steps above to create and install the VSIX package
