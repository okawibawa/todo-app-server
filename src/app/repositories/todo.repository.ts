import { db } from "../../lib/db";

import { TodosId } from "../../lib/db/schema/public/Todos";

const todo = () => {
  const getTodos = async () => {
    try {
      const todos = await db.selectFrom("todos").selectAll().execute();

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

  return { getTodos, deleteTodo };
};

export const todoRepository = todo();
