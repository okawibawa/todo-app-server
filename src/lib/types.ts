import { UpgradeWebSocket } from "hono/ws"
import { ServerWebSocket } from "bun"

export type Variables = {
  upgradeWebSocket: UpgradeWebSocket<ServerWebSocket>
}
