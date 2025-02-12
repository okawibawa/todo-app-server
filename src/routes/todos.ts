import { Hono } from "hono";

import { todoRepository } from "../app/repositories/todo.repository";

import { TodosId } from "../lib/db/schema/public/Todos";

const todos = new Hono();

todos.get("/", async (c) => {
  const todos = await todoRepository.getTodos();

  return c.json(todos);
});

todos.delete("/:id", async (c) => {
  const { id } = c.req.param();

  const todo = await todoRepository.deleteTodo(id as TodosId);

  return c.json(todo);
});

export default todos;
