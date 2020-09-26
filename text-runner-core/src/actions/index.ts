import * as config from "../configuration/index"
import * as linkTargets from "../link-targets"
import * as ast from "../ast"
import * as run from "../run"

export { Finder } from "./finder"
export * from "./name"

/**
 * A user-defined or built-in function that tests an active block
 */
export type Action = (params: Args) => Result

export interface Args {
  /** TextRunner configuration data derived from the config file and CLI switches */
  configuration: config.Data

  /** the AST nodes of the active region which the current action tests */
  region: ast.NodeList

  /** the AST nodes of the active region which the current action tests */
  document: ast.NodeList

  /** name of the file in which the currently tested active region is */
  file: string

  /** line in the current file at which the currently tested active region starts */
  line: number

  /** allows printing test output to the user, behaves like console.log */
  log: run.LogFn

  /**
   * Name allows to provide a more specific name for the current action.
   *
   * As an example, the generic step name `write file` could be refined to
   * `write file "foo.yml"` once the name of the file to be written
   * has been extracted from the document AST.
   */
  name: run.RefineNameFn

  /** all link targets in the current documentation  */
  linkTargets: linkTargets.List

  /** return the action with this value to signal that it is being skipped */
  SKIPPING: 254
}

/** the result of an action function */
export type Result = 254 | undefined

export interface FunctionRepo {
  [key: string]: Action
}