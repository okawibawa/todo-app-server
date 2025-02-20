import { db } from ".";

async function main() {
  console.log("Seeding started.");

  await db
    .insertInto("todos")
    .values([
      {
        title: "Learn Golang.",
        completed: false,
        rank: 1000,
      },
      {
        title: "Learn Python.",
        completed: false,
        rank: 2000,
      },
      {
        title: "Buy egg.",
        completed: true,
        rank: 3000,
      },
      {
        title: "Buy nukes.",
        completed: true,
        rank: 4000,
      },
      {
        title: "Buy grapes.",
        completed: true,
        rank: 5000,
      },
    ])
    .execute();

  await db
    .insertInto("rank_minmax")
    .values([
      {
        min: 1000,
        max: 5000,
      },
    ])
    .execute();

  console.log("Seeding finished.");
}

main()
  .then(() => {})
  .catch((error) => console.error(error))
  .finally(() => process.exit(0));
