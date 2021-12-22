# Release

Steps to release new version.

1. Commit latest changes/fixes
1. Update `./CHANGELOG.md`
1. Update version number `yarn version --minor|patch`
1. Commit changes following commit title convention: `Bump vscode-cue-fmt from 0.0.1 to 0.0.2`
1. Push changes: `git push && git push --tags`
1. Package extension: `vsce package` ? is this necessary?
1. Publish extension: `vsce publish`
1. ...wait, it takes a couple of minutes for change to be available in Marketplace
