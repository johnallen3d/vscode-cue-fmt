# Release

Steps to release new version.

## Prepare and Merge Release Pull Request

Create a pull request to represent a new release.

1. Commit latest changes/fixes
1. Update version number in `./package.json`
1. Update `./CHANGELOG.md`
1. Commit changes following commit title convention: `Bump vscode-cue-fmt from 0.0.1 to 0.0.2`

## Trigger a Release to VS Code Marketplace

After merging the release PR, push version tag to trigger the release action on GitHub.

1. Tag release commit: `git tag -m "v0.0.1" -a "v0.0.1"`
1. Push changes: `git push --tags`
1. Create a GitHub Release: `gh release create v0.1.1 --generate-notes --title vscode-cue-fmt 0.1.1`
1. ...wait, it takes a couple of minutes for change to be available in Marketplace
