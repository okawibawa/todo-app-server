import { db } from "../../lib/db";

const todo = () => {
  const getTodos = async () => {
    try {
      const todos = await db.selectFrom("todos").selectAll().execute();

      return todos;
    } catch (error) {
      throw error;
    }
  };

  return { getTodos };
};

export const todoRepository = todo();
