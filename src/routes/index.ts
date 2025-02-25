import { Hono } from "hono";

import todos from "./todos";
import { UpgradeWebSocket, WSContext } from "hono/ws";
import { ServerWebSocket } from "bun";

import { activeConnections } from "../lib/websocket/manager";

export const routes = (app: Hono, upgradeWebSocket: UpgradeWebSocket<ServerWebSocket>) => {
  app.get("/", upgradeWebSocket(() => {
    return {
      onOpen(_, ws) {
        console.log("Connection opened.")
        activeConnections.add(ws)
      },
      onClose(_, ws) {
        console.log("Connection closed.")
        activeConnections.delete(ws)
      }
    }
  }))

  app.route("/todos", todos(upgradeWebSocket));
};
