import { EventEmitter } from "events"
import { Command } from "text-runner-core"

export class VersionCommand extends EventEmitter implements Command {
  async execute() {
    const { version } = require("../../package.json")
    this.emit("output", `TextRunner v${version}`)
  }
}
