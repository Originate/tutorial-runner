import { Configuration } from "../configuration/configuration.js"

import chalk from "chalk"
import executeSequential from "../runners/execute-sequential.js"
import extractActivities from "../activity-list/extract-activities.js"
import extractImagesAndLinks from "../activity-list/extract-images-and-links.js"
import findLinkTargets from "../link-targets/find-link-targets.js"
import rimraf from "rimraf"
import createWorkingDir from "../working-dir/create-working-dir.js"
import readAndParseFile from "../parsers/read-and-parse-file.js"
import getFileNames from "../finding-files/get-filenames.js"
import StatsCounter from "../runners/stats-counter.js"

async function dynamicCommand(config: Configuration): Promise<Array<Error>> {
  const stats = new StatsCounter()

  // step 0: create working dir
  if (!config.workspace) {
    config.workspace = createWorkingDir(config.useSystemTempDirectory)
  }

  // step 1: find files
  const filenames = getFileNames(config)
  if (filenames.length === 0) {
    console.log(chalk.magenta("no Markdown files found"))
    return []
  }

  // step 2: read and parse files
  const ASTs = await Promise.all(filenames.map(readAndParseFile))

  // step 3: find link targets
  const linkTargets = findLinkTargets(ASTs)

  // step 4: extract activities
  const activities = extractActivities(ASTs, config.classPrefix)
  const links = extractImagesAndLinks(ASTs)
  if (activities.length === 0 && links.length === 0) {
    console.log(chalk.magenta("no activities found"))
    return []
  }

  // step 5: execute the ActivityList
  process.chdir(config.workspace)
  var error = await executeSequential(activities, config, linkTargets, stats)

  // step 6: cleanup
  process.chdir(config.sourceDir)
  if (error && !config.keepTmp) rimraf.sync(config.workspace)

  // step 7: write stats
  var text = "\n"
  var color
  if (error) {
    color = chalk.red
    text += chalk.red(`1 error, `)
  } else {
    color = chalk.green
    text += chalk.green("Success! ")
  }
  text += color(
    `${activities.length + links.length} activities in ${
      filenames.length
    } files`
  )
  if (stats.warnings() > 0) {
    text += color(", ")
    text += chalk.magenta(`${stats.warnings()} warnings`)
  }
  text += color(`, ${stats.duration()}`)
  console.log(chalk.bold(text))
  if (error) {
    return [error]
  } else {
    return []
  }
}

export default dynamicCommand
