import { Configuration } from "../configuration/configuration.js"

import chalk from "chalk"
import deb from "debug"
import isGlob from "is-glob"
import AbsoluteFilePath from "../domain-model/absolute-file-path.js"
import UnprintedUserError from "../errors/unprinted-user-error.js"
import filesMatchingGlob from "../helpers/files-matching-glob.js"
import hasDirectory from "../helpers/has-directory.js"
import allMarkdownFiles from "./all-markdown-files.js"
import isMarkdownFile from "./is-markdown-file.js"
import markdownFilesInDir from "./markdown-files-in-dir.js"
import removeExcludedFiles from "./remove-excluded-files.js"

const debug = deb("text-runner:run-command")

// Returns the name of all files/directories that match the given glob
export default function(config: Configuration): AbsoluteFilePath[] {
  let filenames = getFiles(config)
  filenames = removeExcludedFiles(filenames, config.exclude)
  debugFilenames(filenames)
  return filenames
}

function getFiles(config: Configuration): AbsoluteFilePath[] {
  if (config.fileGlob === "") {
    return allMarkdownFiles(config.fileGlob)
  } else if (hasDirectory(config.fileGlob)) {
    return markdownFilesInDir(config.fileGlob)
  } else if (isMarkdownFile(config.fileGlob)) {
    return [new AbsoluteFilePath(config.fileGlob)]
  } else if (isGlob(config.fileGlob)) {
    return filesMatchingGlob(config.fileGlob)
  } else {
    throw new UnprintedUserError(
      `file or directory does not exist: ${chalk.red(config.fileGlob)}`
    )
  }
}

function debugFilenames(filenames: AbsoluteFilePath[]) {
  debug("testing files:")
  for (const filename of filenames) {
    debug(`  * ${filename.platformified()}`)
  }
}
