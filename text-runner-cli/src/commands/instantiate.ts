import * as config from "../configuration"
import * as tr from "text-runner-core"
import * as scaffold from "./scaffold"
import { HelpCommand } from "./help"
import { SetupCommand } from "./setup"
import { VersionCommand } from "./version"

export async function instantiate(
  commandName: string,
  userConfig: config.Data,
  debugSubcommand: tr.commands.DebugSubcommand | undefined
): Promise<tr.Command> {
  const sourceDir = userConfig.sourceDir || "."
  switch (commandName) {
    case "help":
      return new HelpCommand()
    case "scaffold":
      if (!userConfig.files) {
        throw new Error("no action name given")
      }
      return new scaffold.ScaffoldCommand(userConfig.files, sourceDir, userConfig.scaffoldLanguage || "js")
    case "setup":
      return new SetupCommand(userConfig)
    case "version":
      return new VersionCommand()
  }
  const trConfig = userConfig.toCoreConfig()
  switch (commandName) {
    case "debug":
      return new tr.commands.DebugCommand(trConfig, debugSubcommand)
    case "dynamic":
      return new tr.commands.DynamicCommand(trConfig)
    case "run":
      return new tr.commands.RunCommand(trConfig)
    case "static":
      return new tr.commands.StaticCommand(trConfig)
    case "unused":
      return new tr.commands.UnusedCommand(trConfig)
    default:
      throw new tr.UserError(`unknown command: ${commandName}`)
  }
}
