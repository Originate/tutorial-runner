import * as color from "colorette"
import * as path from "path"
import { UserError } from "../../../text-runner-core/src/errors/user-error"
import { printCodeFrame } from "../helpers/print-code-frame"

/** prints the given error to the console */
export function printUserError(err: UserError) {
  if (err.file && err.line != null) {
    console.log(color.red(`${err.file.unixified()}:${err.line} -- ${err.message || ""}`))
  } else {
    console.log(color.red(err.message))
  }
  if (err.guidance) {
    console.log()
    console.log(err.guidance)
  }
  const filePath = path.join(process.cwd(), err.file?.platformified() || "")
  printCodeFrame(console.log, filePath, err.line)
}