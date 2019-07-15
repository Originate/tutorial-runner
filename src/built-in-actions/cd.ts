import chalk from 'chalk'
import path from 'path'
import { ActionArgs } from '../runners/action-args'

// Changes the current working directory to the one given in the hyperlink or code block
export default function cd(args: ActionArgs) {
  const directory = args.nodes.text()
  args.formatter.name(
    `changing into the ${chalk.bold(chalk.cyan(directory))} directory`
  )
  const fullPath = path.join(args.configuration.workspace, directory)
  args.formatter.log(`cd ${fullPath}`)
  try {
    process.chdir(fullPath)
  } catch (e) {
    if (e.code === 'ENOENT') {
      throw new Error(`directory ${directory} not found`)
    }
    throw e
  }
}