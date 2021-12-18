# vscode-cue-fmt

Format CUE files using `cue fmt`.

## Setup

CUE must be installed and `cue` must be on the users `$PATH`.

```sh
# MacOS
brew install cue-lang/tap/cue
# more info: https://cuelang.org/docs/install/
```

Enable "format on save" VS Code setting.

```jsonc
// settings.json
"editor.formatOnSave": true
```

## Why?

I've grown accustomed to the format on save feature that's enabled by default with the [NeoVim CUE plugin that I use](https://github.com/jjo/vim-cue) and was dissapointed to find that the existing [CUE extension for VS Code](https://github.com/cue-sh/vscode-cue/) did not support this feature. Eventually that extension will support formatting via LSP but there is no telling when CUE LSP will be available. In the meantime this should do the trick.

## Status

**Alpha** -- I've never written TypeScript let alone a VS Code extension. The code in this extension is _extremely_ niave and has little to no error handling. Use at your own risk.

