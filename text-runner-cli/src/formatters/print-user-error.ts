import * as color from "colorette"
import * as path from "path"
import * as tr from "text-runner-core"
import * as helpers from "../helpers"

/** prints the given error to the console */
export function printUserError(err: tr.UserError): void {
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
  helpers.printCodeFrame(console.log, filePath, err.line)
}