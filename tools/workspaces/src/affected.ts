import * as color from "colorette"
import * as os from "os"
import * as fs from "fs"
import { YarnReader, YarnOutput } from "./yarn-reader"
import { WorkspaceTagger } from "./workspace-tagger"
import { LogFunc } from "./log-func"

export function affected(yarnOutput: YarnOutput, log: LogFunc) {
  const yarnReader = new YarnReader(yarnOutput)

  // determine the provided workspaces
  const files = fs.readFileSync(0, "utf-8").split(os.EOL)
  const taggedWorkspaces = new WorkspaceTagger(yarnReader.workspaces())
  for (const file of files) {
    const workspace = taggedWorkspaces.workspaceOf(file)
    taggedWorkspaces.tag(workspace)
  }
  const providedWorkspaces = taggedWorkspaces.tagged()
  log("changed workspaces:", providedWorkspaces)

  // determine the affected workspaces
  for (const workspace of providedWorkspaces) {
    const downstreams = yarnReader.downstreamsFor(workspace)
    for (const downstream of downstreams) {
      if (!taggedWorkspaces.isTagged(downstream)) {
        log(`${color.cyan(workspace)} is a downstream of ${color.cyan(downstream)}`)
      }
    }
    taggedWorkspaces.tagMany(downstreams)
  }
  const affectedWorkspaces = taggedWorkspaces.tagged()
  log("all affected workspaces:", affectedWorkspaces)

  // write to STDOUT
  console.log(affectedWorkspaces.join(os.EOL))
}
