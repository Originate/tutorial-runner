import * as color from "colorette"
import * as fs from "fs-extra"
import * as path from "path"
import { ActionArgs } from "text-runner"
import { makefileTargets } from "../helpers/makefile-targets"

/** verifies that the Makefile in the sourceDir contains the enclosed target */
export async function target(action: ActionArgs) {
  const target = action.nodes.text().trim()
  if (target === "") {
    throw new Error("Empty make target")
  }
  action.name(`make target ${color.cyan(target)}`)
  const makefile = await fs.readFile(path.join(action.configuration.sourceDir, "Makefile"), "utf8")
  const targets = makefileTargets(makefile)
  if (!targets.includes(target)) {
    throw new Error(
      `Makefile does not contain target ${color.cyan(target)} but these ones: ${color.cyan(targets.join(", "))}`
    )
  }
}