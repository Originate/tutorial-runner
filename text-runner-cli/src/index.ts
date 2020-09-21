import * as cliCursor from "cli-cursor"
import { endChildProcesses } from "end-child-processes"
import * as formatters from "./formatters"
import * as commands from "./commands"
import * as helpers from "./helpers"
import * as tr from "text-runner-core"
import * as cmdLine from "./cmdline"
import * as configFile from "./config-file"

cliCursor.hide()

async function main() {
  let errorCount = 0
  try {
    const { commandName, cmdLineConfig, debugSubcommand } = cmdLine.parse(process.argv)
    const fileConfig = await configFile.load(cmdLineConfig)
    const userConfig = fileConfig.merge(cmdLineConfig)
    const command = await commands.instantiate(commandName, userConfig, debugSubcommand)
    const formatter = formatters.instantiate(
      userConfig.formatterName || "detailed",
      userConfig.sourceDir || ".",
      command
    )
    const statsCollector = new helpers.StatsCollector(command)
    await command.execute()
    const stats = statsCollector.stats()
    if (["dynamic", "run", "static"].includes(commandName)) {
      formatter.finish({ stats })
    }
    errorCount = stats.errorCount
  } catch (err) {
    errorCount += 1
    if (err instanceof tr.UserError) {
      formatters.printUserError(err)
    } else {
      console.log(err.stack)
    }
  } finally {
    await endChildProcesses()
  }
  process.exit(errorCount)
}
main()