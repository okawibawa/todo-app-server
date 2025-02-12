import { db } from ".";

async function main() {
  console.log("Seeding started.");

  await db
    .insertInto("todos")
    .values([
      {
        title: "Learn Golang.",
        completed: false,
      },
      {
        title: "Learn Python.",
        completed: false,
      },
      {
        title: "Buy egg.",
        completed: true,
      },
    ])
    .execute();

  console.log("Seeding finished.");
}

main()
  .then(() => {})
  .catch((error) => console.error(error))
  .finally(() => process.exit(0));
