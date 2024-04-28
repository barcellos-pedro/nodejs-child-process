import { faker } from "@faker-js/faker"
import { sleep } from "./helpers.js"

const DB = []

export function seedDatabase(totalEntries) {
  console.log("Total entries:", totalEntries)

  for (let i = 1; i <= totalEntries; i++) {
    DB.push({
      id: i,
      name: faker.person.fullName(),
      created_at: faker.date.past(),
    })
  }
}

export async function* getPagedData({ limit = 5 }) {
  console.log("db limit:", limit)
  do {
    console.log("Items remaining:", DB.length)
    await sleep(2_000)
    yield DB.splice(0, limit)
  } while (DB.length)

  console.log("No items left:", DB.length)
  return
}
