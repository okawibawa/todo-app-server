import { Hono } from "hono";

import { todoRepository } from "../app/repositories/todo.repository";

import { TodosId } from "../lib/db/schema/public/Todos";

import { serializeTodo } from "../lib/utils";
import { UpgradeWebSocket } from "hono/ws";
import { ServerWebSocket } from "bun";
import { broadcast } from "../lib/websocket/manager";

export default function(upgradeWebSocket: UpgradeWebSocket<ServerWebSocket>) {
  const todos = new Hono();

  todos.post("/", async (c) => {
    const { title, rank } = await c.req.json();

    const todo = await todoRepository.createTodo({ title, rank });

    broadcast({
      type: "ADD_TODO",
      todo: serializeTodo(todo)
    })

    return c.json(serializeTodo(todo));
  });

  todos.patch('/:id', async (c) => {
    const { id } = c.req.param()
    const payload = await c.req.json()

    const todo = await todoRepository.updateTodo(id as TodosId, payload)

    broadcast({
      type: "UPDATE_TODO",
      todo: serializeTodo(todo)
    })

    return c.json(serializeTodo(todo))
  })

  todos.get("/", async (c) => {
    const todos = await todoRepository.getTodos();

    return c.json(todos);
  });

  todos.delete("/completed", async (c) => {
    const todos = await todoRepository.deleteCompletedTodos();

    broadcast({
      type: "DELETE_COMPLETED_TODOS",
      todo: serializeTodo(todos)
    })

    return c.json(serializeTodo(todos[0]));
  });

  todos.delete("/:id", async (c) => {
    try {
      const { id } = c.req.param();

      const todo = await todoRepository.deleteTodo(id as TodosId);

      // Convert `numDeletedRows` to `number` since it won't exceed `Number.MAX_SAFE_INTEGER` (~9 quadrillion)
      if (!todo || Number(todo.numDeletedRows) === 0) {
        return c.json({ error: "Todo not found" }, 400)
      }

      broadcast({
        type: "DELETE_TODO",
        todo: serializeTodo(todo)
      })

      return c.json(serializeTodo(todo));
    } catch (error) {
      console.log("Failed to delete todo: ", error)
      return c.json({ error: "Failed to delete todo." }, 500)
    }
  });

  return todos;
}
