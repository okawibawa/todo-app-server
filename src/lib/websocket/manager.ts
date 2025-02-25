import { WSContext } from "hono/ws";
import { ServerWebSocket } from "bun";

export const activeConnections: Set<WSContext<ServerWebSocket<undefined>>> = new Set()

export const broadcast = (message: any) => {
  const messageString = JSON.stringify(message)

  activeConnections.forEach((ws) => {
    if (ws.readyState === 1) {
      ws.send(messageString)
    }
  })
}
