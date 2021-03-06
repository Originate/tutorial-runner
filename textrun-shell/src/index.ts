import { command } from "./actions/command"
import { commandOutput } from "./actions/command-output"
import { commandWithInput } from "./actions/command-with-input"
import { server } from "./actions/server"
import { serverOutput } from "./actions/server-output"
import { stopServer } from "./actions/stop-server"

export const textrunActions = {
  command,
  commandOutput,
  commandWithInput,
  serverOutput,
  server,
  stopServer,
}
