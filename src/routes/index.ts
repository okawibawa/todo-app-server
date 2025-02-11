import { Hono } from "hono";
import { logger } from "hono/logger";

export const routes = (app: Hono) => {
  app.use(logger());

  app.get("/", (c) => {
    return c.json({
      uptime: process.uptime(),
      message: "Ok",
      date: new Date(),
    });
  });
};
