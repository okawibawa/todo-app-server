import { Hono } from "hono";
import { logger } from "hono/logger";

import todos from "./todos";

export const routes = (app: Hono) => {
  app.use(logger());

  app.get("/", (c) => {
    return c.json({
      uptime: process.uptime(),
      message: "Ok",
      date: new Date(),
    });
  });

  app.route("/todos", todos);
};
