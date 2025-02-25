import { Hono } from "hono";

import { todoRepository } from "../app/repositories/todo.repository";

import { TodosId } from "../lib/db/schema/public/Todos";

import { serializeTodo } from "../lib/utils";

const todos = new Hono();

todos.post("/", async (c) => {
  const { title, rank } = await c.req.json();

  const todo = await todoRepository.createTodo({ title, rank });

  return c.json(serializeTodo(todo));
});

todos.patch('/', async (c) => {
  const todo = await todoRepository.updateTodo(1, { title: "new title" })

  return c.json({ message: "updated" })
})

todos.get("/", async (c) => {
  const todos = await todoRepository.getTodos();

  return c.json(todos);
});

todos.delete("/completed", async (c) => {
  const todos = await todoRepository.deleteCompletedTodos();

  return c.json(serializeTodo(todos[0]));
});

todos.delete("/:id", async (c) => {
  const { id } = c.req.param();

  const todo = await todoRepository.deleteTodo(id as TodosId);

  return c.json(serializeTodo(todo));
});

export default todos;
