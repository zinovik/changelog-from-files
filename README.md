### changelog-from-files

This tiny package aimed to avoid regular CHANGELOG file merge conflicts caused by using the git flow.

The idea is to create a separate file for each change and then combine the changes from each of them into the text changelog file.

### example

Check the `./example` directory and run `npm run example` to see how it works.

### how to use

Run
```bash
npx changelog-from-files \
  --unreleased-path <UNRELEASED_FOLDER_PATH> \
  --changelog-path <CHANGELOG_FILE_PATH> \
  --unreleased-section <UNRELEASED_SECTION> \
  --ignored-files <FILE_NAMES_TO_IGNORE>
```

Default values:

```typescript
UNRELEASED_FOLDER_PATH = "unreleased"
CHANGELOG_FILE_PATH = "CHANGELOG.md"
UNRELEASED_SECTION = "## [Unreleased]"
FILE_NAMES_TO_IGNORE = ".gitkeep,.gitignore"
```
