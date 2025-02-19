export const serializeTodo = (todo: any) =>
  JSON.parse(
    JSON.stringify(todo, (_, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );
