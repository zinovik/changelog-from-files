#!/usr/bin/env node
const fs = require("fs");

const UNRELEASED_FOLDER_PATH = process.argv[2] || "unreleased";
const CHANGELOG_FILE_PATH = process.argv[3] || "CHANGELOG.md";
const UNRELEASED_SECTION = process.argv[4] || "## [Unreleased]";
const FILES_TO_IGNORE = (process.argv[5] || ".gitkeep,.gitignore").split(",");

// Read separate files with changes
const changes = fs
  .readdirSync(UNRELEASED_FOLDER_PATH)
  .map((category) => ({
    name: category,
    changes: fs
      .readdirSync(`${UNRELEASED_FOLDER_PATH}/${category}`)
      .map((file) =>
        FILES_TO_IGNORE.includes(file)
          ? ""
          : fs
              .readFileSync(`${UNRELEASED_FOLDER_PATH}/${category}/${file}`)
              .toString()
      )
      .filter((description) => description !== ""),
  }))
  .filter(({ changes }) => changes.length > 0);

if (changes.length === 0) {
  console.info("There are no new changes");
  return;
}

// Format the changes to the single string with categories
const changelog = changes
  .map(({ name, changes }) => `### ${name}\n${changes.join("\n")}`)
  .join(`\n`);

// Update the changelog file with the new changes
const changelogFile = fs.readFileSync(CHANGELOG_FILE_PATH).toString();

fs.writeFileSync(
  CHANGELOG_FILE_PATH,
  changelogFile.replace(
    UNRELEASED_SECTION,
    `${UNRELEASED_SECTION}\n${changelog}`
  )
);

// Remove separate files with changes
fs.readdirSync(UNRELEASED_FOLDER_PATH).forEach((category) =>
  fs.readdirSync(`${UNRELEASED_FOLDER_PATH}/${category}`).forEach((file) => {
    if (!FILES_TO_IGNORE.includes(file)) {
      fs.unlinkSync(`${UNRELEASED_FOLDER_PATH}/${category}/${file}`);
    }
  })
);
