import { extractActivities } from "../activities/extract-activities"
import { getFileNames } from "../filesystem/get-filenames"
import { findLinkTargets } from "../link-targets/find-link-targets"
import * as parsers from "../parsers/index"
import * as run from "../run"
import * as workspace from "../workspace"
import * as actions from "../actions"
import { Command } from "./command"
import * as configuration from "../configuration/index"
import * as events from "../events/index"
import { EventEmitter } from "events"

export class Dynamic implements Command {
  userConfig: configuration.PartialData
  emitter: EventEmitter

  constructor(userConfig: configuration.PartialData) {
    this.userConfig = userConfig
    this.emitter = new EventEmitter()
  }

  emit(name: events.CommandEvent, payload: events.Args): void {
    this.emitter.emit(name, payload)
  }

  async execute(): Promise<void> {
    const originalDir = process.cwd()
    try {
      // step 1: determine full configuration
      const config = configuration.backfillDefaults(this.userConfig)

      // step 2: create working dir
      if (!config.workspace) {
        config.workspace = await workspace.create(config)
      }

      // step 3: find files
      const filenames = await getFileNames(config)
      if (filenames.length === 0) {
        const warnArgs: events.WarnArgs = { message: "no Markdown files found" }
        this.emit("warning", warnArgs)
        return
      }

      // step 4: read and parse files
      const ASTs = await parsers.markdown.parse(filenames, config.sourceDir)

      // step 5: find link targets
      const linkTargets = findLinkTargets(ASTs)

      // step 6: extract activities
      const activities = extractActivities(ASTs, config.regionMarker)
      if (activities.length === 0) {
        const warnArgs: events.WarnArgs = { message: "no activities found" }
        this.emit("warning", warnArgs)
        return
      }

      // step 7: find actions
      const actionFinder = actions.Finder.loadDynamic(config.sourceDir)

      // step 8: execute the ActivityList
      const startArgs: events.StartArgs = { stepCount: activities.length }
      this.emit("start", startArgs)
      process.chdir(config.workspace)
      await run.sequential(activities, actionFinder, config, linkTargets, this)
    } finally {
      process.chdir(originalDir)
    }
  }

  on(name: events.CommandEvent, handler: events.Handler): this {
    this.emitter.on(name, handler)
    return this
  }
}
