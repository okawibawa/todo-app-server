import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { createBunWebSocket } from 'hono/bun'
import type { ServerWebSocket } from 'bun'

import { routes } from "./routes";

const { upgradeWebSocket, websocket } =
  createBunWebSocket<ServerWebSocket>()

const app = new Hono();

app.use(cors());
app.use(logger());

routes(app, upgradeWebSocket);

app.onError((error, c) => {
  return c.json({ message: error.message || "Internal server error" }, 500);
});

app.notFound((c) => {
  return c.json({ message: "Not found!" }, 404);
});

export default {
  port: 3010,
  fetch: app.fetch,
  websocket
};
