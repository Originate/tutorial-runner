import { ActionFinder } from "../actions/action-finder"
import { extractActivities } from "../activity-list/extract-activities"
import { getFileNames } from "../filesystem/get-filenames"
import { parseMarkdownFiles } from "../parsers/markdown/parse-markdown-files"
import { EventEmitter } from "events"
import { CommandEvent, Command } from "./command"
import { WarnArgs } from "../formatters/formatter"
import { UserProvidedConfiguration } from "../configuration/types/user-provided-configuration"
import { loadConfiguration } from "../configuration/load-configuration"
import { Configuration } from "../configuration/types/configuration"

export class UnusedCommand extends EventEmitter implements Command {
  config: Configuration

  constructor(config: Configuration) {
    super()
    this.config = config
  }

  static async create(userConfig: UserProvidedConfiguration) {
    const config = await loadConfiguration(userConfig)
    return new UnusedCommand(config)
  }

  async execute() {
    // step 2: find files
    const filenames = await getFileNames(config)
    if (filenames.length === 0) {
      const warnArgs: WarnArgs = { message: "no Markdown files found" }
      this.emit(CommandEvent.warning, warnArgs)
      return
    }

    // step 3: read and parse files
    const ASTs = await parseMarkdownFiles(filenames, config.sourceDir)

    // step 4: extract activities
    const usedActivityNames = extractActivities(ASTs, config.regionMarker).map((activity) => activity.actionName)

    // step 5: find defined activities
    const definedActivityNames = ActionFinder.load(config.sourceDir).customActionNames()

    // step 6: identify unused activities
    const unusedActivityNames = definedActivityNames.filter(
      (definedActivityName) => !usedActivityNames.includes(definedActivityName)
    )

    // step 7: write results
    this.emit(CommandEvent.output, "Unused activities:")
    for (const unusedActivityName of unusedActivityNames) {
      this.emit(CommandEvent.output, `- ${unusedActivityName}`)
    }
  }
}
