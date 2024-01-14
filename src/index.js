#!/usr/bin/env node
const fs = require("fs");

const getCommandLineParameter = (processArgv, name) => {
  const nameIndex = processArgv.indexOf(name);

  return nameIndex > -1 ? processArgv[nameIndex + 1] : null;
};

const UNRELEASED_FOLDER_PATH =
  getCommandLineParameter(process.argv, "unreleased-path") || "unreleased";
const CHANGELOG_FILE_PATH =
  getCommandLineParameter(process.argv, "changelog-path") || "CHANGELOG.md";
const UNRELEASED_SECTION =
  getCommandLineParameter(process.argv, "unreleased-section") ||
  "## [Unreleased]";
const FILE_NAMES_TO_IGNORE = (
  getCommandLineParameter(process.argv, "ignored-files") ||
  ".gitkeep,.gitignore"
).split(",");

const readChangesFromSeparateFiles = (folderPath, fileNamesToIgnore) =>
  fs.readdirSync(folderPath).map((categoryName) => ({
    name: categoryName,
    changes: fs
      .readdirSync(`${folderPath}/${categoryName}`)
      .filter((fileName) => !fileNamesToIgnore.includes(fileName))
      .map((fileName) =>
        fs.readFileSync(`${folderPath}/${categoryName}/${fileName}`).toString()
      ),
  }));

const formatChangesToSingleString = (changes) =>
  changes
    .map((category) => ({
      name: category.name,
      changesString: category.changes
        .join("\n")
        .split("\n")
        .filter((changesLine) => changesLine !== "")
        .join("\n"),
    }))
    .filter((category) => category.changesString !== "")
    .map((category) => `### ${category.name}\n${category.changesString}`)
    .join("\n");

const updateChangelogFileWithNewChanges = (
  changelogFilePath,
  unreleasedSection,
  changes
) => {
  const changelogFile = fs.readFileSync(changelogFilePath).toString();

  fs.writeFileSync(
    changelogFilePath,
    changelogFile.replace(unreleasedSection, `${unreleasedSection}\n${changes}`)
  );
};

const removeSeparateFilesWithChanges = (folderPath, fileNamesToIgnore) =>
  fs.readdirSync(folderPath).forEach((categoryName) =>
    fs
      .readdirSync(`${folderPath}/${categoryName}`)
      .filter((fileName) => !fileNamesToIgnore.includes(fileName))
      .forEach((fileName) =>
        fs.unlinkSync(`${folderPath}/${categoryName}/${fileName}`)
      )
  );

///

const allChanges = readChangesFromSeparateFiles(
  UNRELEASED_FOLDER_PATH,
  FILE_NAMES_TO_IGNORE
);

if (allChanges.length === 0) {
  console.info("There are no new changes");
  return;
}

const changelogChanges = formatChangesToSingleString(allChanges);

updateChangelogFileWithNewChanges(
  CHANGELOG_FILE_PATH,
  UNRELEASED_SECTION,
  changelogChanges
);

removeSeparateFilesWithChanges(UNRELEASED_FOLDER_PATH, FILE_NAMES_TO_IGNORE);
