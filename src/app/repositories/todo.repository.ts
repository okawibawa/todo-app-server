import { db } from "../../lib/db";

import { NewTodos, TodosId } from "../../lib/db/schema/public/Todos";

const todo = () => {
  const createTodo = async (input: NewTodos) => {
    try {
      const todo = await db
        .insertInto("todos")
        .values({
          title: input.title,
        })
        .executeTakeFirst();

      return todo;
    } catch (error) {
      throw error;
    }
  };

  const getTodos = async () => {
    try {
      const todos = await db
        .selectFrom("todos")
        .selectAll()
        .orderBy("todos.created_at", "asc")
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

  return { createTodo, getTodos, deleteTodo, deleteCompletedTodos };
};

export const todoRepository = todo();
