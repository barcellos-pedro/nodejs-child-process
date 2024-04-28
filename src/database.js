import { faker } from "@faker-js/faker"
import { sleep } from "./helpers.js"

const DB = []

export function seedDatabase(count = 60) {
  for (let i = 1; i <= count; i++) {
    DB.push({
      id: i,
      name: faker.person.fullName(),
      created_at: faker.date.past(),
    })
  }
}

export async function* getPagedData(limit = 10) {
  do {
    console.log("Items remaining:", DB.length)
    await sleep()
    yield DB.splice(0, limit)
  } while (DB.length)

  console.log("No items left:", DB.length)
  return
}
