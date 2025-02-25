import { db } from "../../lib/db";

import { NewTodos, TodosId } from "../../lib/db/schema/public/Todos";

const todo = () => {
  const createTodo = async (input: NewTodos) => {
    try {
      const todo = await db
        .insertInto("todos")
        .values({
          title: input.title,
          rank: 900,
        })
        .executeTakeFirst();

      return todo;
    } catch (error) {
      throw error;
    }
  };

  const updateTodo = async (id: number, payload: { title?: string, completed?: boolean }) => {
    console.log(id, { title: payload.title, completed: payload.completed })
  }

  const getTodos = async () => {
    try {
      const todos = await db
        .selectFrom("todos")
        .selectAll()
        .orderBy("todos.created_at", "desc")
        .execute();

      return todos;
    } catch (error) {
      throw error;
    }
  };

  const deleteTodo = async (id: TodosId) => {
    try {
      const todo = await db
        .deleteFrom("todos")
        .where("todos.id", "=", id)
        .executeTakeFirst();

      return todo;
    } catch (error) {
      throw error;
    }
  };

  const deleteCompletedTodos = async () => {
    try {
      const todos = await db
        .deleteFrom("todos")
        .where("todos.completed", "=", true)
        .execute();

      return todos;
    } catch (error) {
      throw error;
    }
  };

  return { createTodo, updateTodo, getTodos, deleteTodo, deleteCompletedTodos };
};

export const todoRepository = todo();
