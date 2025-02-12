import { Hono } from "hono";
import { cors } from "hono/cors";

import { routes } from "./routes";

const app = new Hono();

app.use(cors());

routes(app);

app.onError((error, c) => {
  return c.json({ message: error.message || "Internal server error" }, 500);
});

app.notFound((c) => {
  return c.json({ message: "Not found!" }, 404);
});

export default {
  port: 3001,
  fetch: app.fetch,
};
