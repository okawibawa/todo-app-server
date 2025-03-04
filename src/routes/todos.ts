import { Hono } from "hono";

import { todoRepository } from "../app/repositories/todo.repository";

import { TodosId } from "../lib/db/schema/public/Todos";

import { serializeTodo } from "../lib/utils";
import { UpgradeWebSocket } from "hono/ws";
import { ServerWebSocket } from "bun";
import { broadcast } from "../lib/websocket/manager";
import { unknown } from "zod";
import { UnknownRow } from "kysely";

export default function(upgradeWebSocket: UpgradeWebSocket<ServerWebSocket>) {
  const todos = new Hono();

  todos.post("/", async (c) => {
    try {
      const { title, rank } = await c.req.json();

      if (!title || typeof title !== "string") {
        return c.json({ error: "Title is required and must be a string" }, 400);
      }

      const todo = await todoRepository.createTodo({ title, rank });

      if (Number(todo.numInsertedOrUpdatedRows) === 0) {
        return c.json({ error: "Failed to add todo" }, 400)
      }

      broadcast({
        type: "ADD_TODO",
        todo: serializeTodo(todo)
      })

      return c.json(serializeTodo(todo));
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Failed to add todo: ", {
          message: error.message,
          stack: error.stack
        })

        return c.json({ error: "Failed to add todo.", details: error.message }, 500)
      }

      console.log("Failed to add todo: ", error)

      return c.json({ error: "Failed to add todo." }, 500)
    }
  });

  todos.patch('/:id', async (c) => {
    try {
      const { id } = c.req.param()
      const payload = await c.req.json()

      const todo = await todoRepository.updateTodo(id as TodosId, payload)

      if (Number(todo[0].numUpdatedRows) === 0) {
        return c.json({ error: "Failed to update todo" }, 400)
      }

      broadcast({
        type: "UPDATE_TODO",
        todo: serializeTodo(todo)
      })

      return c.json(serializeTodo(todo))
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Failed to update todo: ", {
          message: error.message,
          stack: error.stack
        })

        return c.json({ error: "Failed to update todo.", details: error.message }, 500)
      }

      console.log("Failed to update todo: ", error)

      return c.json({ error: "Failed to update todo." }, 500)
    }
  })

  todos.get("/", async (c) => {
    try {
      const todos = await todoRepository.getTodos();

      return c.json(todos);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Failed to get todo: ", {
          message: error.message,
          stack: error.stack
        })

        return c.json({ error: "Failed to get todo.", details: error.message }, 500)
      }

      console.log("Failed to get todo: ", error)

      return c.json({ error: "Failed to get todo." }, 500)
    }
  });

  todos.delete("/completed", async (c) => {
    try {
      const todos = await todoRepository.deleteCompletedTodos();

      if (Number(todos[0].numDeletedRows) === 0) {
        return c.json({ error: "Failed to delete completed todo" }, 400)
      }

      broadcast({
        type: "DELETE_COMPLETED_TODOS",
        todo: serializeTodo(todos)
      })

      return c.json(serializeTodo(todos[0]));
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Failed to delete complete todo: ", {
          message: error.message,
          stack: error.stack
        })

        return c.json({ error: "Failed to delete complete todo.", details: error.message }, 500)
      }

      console.log("Failed to delete complete todo: ", error)

      return c.json({ error: "Failed to delete complete todo." }, 500)
    }
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
      if (error instanceof Error) {
        console.log("Failed to delete todo: ", {
          message: error.message,
          stack: error.stack
        })

        return c.json({ error: "Failed to delete todo.", details: error.message }, 500)
      }

      console.log("Failed to delete todo: ", error)

      return c.json({ error: "Failed to delete todo." }, 500)
    }
  });

  return todos;
}
