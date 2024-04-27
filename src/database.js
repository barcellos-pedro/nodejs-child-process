import { faker } from "@faker-js/faker"
import { sleep } from "./helpers.js"

const DB = []

export function seedDatabase() {
  for (let i = 1; i <= 30; i++) {
    DB.push({
      id: i,
      name: faker.person.fullName(),
      created_at: faker.date.past(),
    })
  }
}

export async function* getPagedData(limit = 15) {
  await sleep()
  yield DB.slice(0, limit)
  await sleep()
  yield DB.slice(limit)
}
