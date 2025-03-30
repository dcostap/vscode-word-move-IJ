# WordMoveIJ - JetBrains Style Word Movement in VS Code

This extension modifies VS Code's word movement behavior to match JetBrains IDEs.

## Features

WordMoveIJ changes how cursor movement works when using word navigation commands (Ctrl+Left, Ctrl+Right, Ctrl+Shift+Left, Ctrl+Shift+Right). In standard VS Code, word separators are often skipped over when navigating by word. This extension makes VS Code treat individual word separators as single-character "words" - matching the behavior found in JetBrains IDEs.

### Key Differences

- When you encounter a word separator (like punctuation), the cursor will stop at each individual character
- Multiple consecutive separators are navigated one at a time, rather than being skipped

## How to Use

The extension provides four commands, mapped to the default `ctrl + left`, `ctrl + shift + left`, etc keybindings:

- `wordmoveij.cursorWordStartLeft` (replaces `cursorWordStartLeft`)
- `wordmoveij.cursorWordEndRight` (replaces `cursorWordEndRight`)
- `wordmoveij.cursorWordStartLeftSelect` (replaces `cursorWordStartLeftSelect`)
- `wordmoveij.cursorWordEndRightSelect` (replaces `cursorWordEndRightSelect`)

> ⚠️ **Warning:** You will need to remove the default bindings for `ctrl + left`, `ctrl + shift + left`, etc. so this extension can take control of those.

```json
[
    {
        "key": "ctrl+left",
        "command": "wordmoveij.cursorWordStartLeft",
        "when": "textInputFocus && !accessibilityModeEnabled"
    },
    {
        "key": "ctrl+right",
        "command": "wordmoveij.cursorWordEndRight",
        "when": "textInputFocus && !accessibilityModeEnabled"
    },
    {
        "key": "ctrl+shift+left",
        "command": "wordmoveij.cursorWordStartLeftSelect",
        "when": "textInputFocus && !accessibilityModeEnabled"
    },
    {
        "key": "ctrl+shift+right",
        "command": "wordmoveij.cursorWordEndRightSelect",
        "when": "textInputFocus && !accessibilityModeEnabled"
    }
]
```

## Requirements

This extension uses VS Code's built-in word separator configuration. You can customize which characters are considered word separators by modifying the `editor.wordSeparators` setting in your preferences.

## Known Issues

Please report any issues on the GitHub repository.

## Release Notes

### 0.0.1

Initial release of WordMoveIJ with support for basic JetBrains-style word navigation.
