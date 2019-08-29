import { Configuration } from "../../configuration/types/configuration"
import { ActionArgs } from "../types/action-args"

type DoneFunction = (err?: Error) => void

// Runs the JavaScript code given in the code block
export default function runJavascript(args: ActionArgs, done: DoneFunction) {
  let code = args.nodes.textInNodeOfType("fence")
  if (code == null) {
    done(new Error("no JavaScript code found in the fenced block"))
    return
  }
  code = replaceSubstitutions(code, args.configuration)
  code = replaceRequireLocalModule(code)
  code = replaceVariableDeclarations(code)

  // This is used in an eval'ed string below
  // @ts-ignore: unused variable
  const __finished = (err: any) => {
    done(err)
  }

  code = hasCallbackPlaceholder(code)
    ? (code = replaceAsyncCallbacks(code)) // async code
    : (code = appendAsyncCallback(code)) // sync code
  eval(code)
}

function appendAsyncCallback(code: string): string {
  return `${code.trim()};\n__finished()`
}

function replaceAsyncCallbacks(code: string): string {
  return code
    .replace("<CALLBACK>", "__finished")
    .replace(/\/\/\s*\.\.\./g, "__finished()")
}

// substitutes replacements configured in text-run.yml
function replaceSubstitutions(code: string, c: Configuration): string {
  try {
    for (const replaceData of c.actions.runJavascript.replace) {
      code = code.replace(replaceData.search, replaceData.replace)
    }
  } catch (e) {
    // ignoring type errors here since `code` has a default value
  }
  return code
}

// makes sure "require('.') works as expected even if running in a temp workspace
function replaceRequireLocalModule(code: string): string {
  return code.replace(/require\(['"].['"]\)/, "require(process.cwd())")
}

// make variable declarations persist across code blocks
function replaceVariableDeclarations(code: string): string {
  return code
    .replace(/\bconst /g, "global.")
    .replace(/\bvar /g, "global.")
    .replace(/\bthis\./g, "global.")
}

// returns whether the given code block contains a callback placeholder
function hasCallbackPlaceholder(code: string): boolean {
  return code.indexOf("<CALLBACK>") > -1 || code.indexOf("// ...") > -1
}