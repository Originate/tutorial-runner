import * as tr from "text-runner"

export default function HelloWorld(action: tr.actions.Args): void {
  action.log("Hello World from TypeScript!")
}
