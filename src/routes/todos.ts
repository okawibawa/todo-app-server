import { Hono } from "hono";

import { todoRepository } from "../app/repositories/todo.repository";

const todos = new Hono();

todos.get("/", async (c) => {
  const todos = await todoRepository.getTodos();

  return c.json(todos);
});

export default todos;
