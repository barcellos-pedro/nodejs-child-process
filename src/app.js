import { seedDatabase, getPagedData } from "./database.js"
import { initCluster } from "./cluster.js"
import { threadCount } from "./helpers.js"

const totalEntries = 1_000

seedDatabase(totalEntries)

console.time("elapsed time")

const { getWorker, killAll } = initCluster({
  maxWorkers: threadCount,
  script: "src/task.js",
  onTaskDone: (count) => {
    if (count !== totalEntries) {
      console.log(`Entries processed: ${count}/${totalEntries}`)
      return
    }

    console.log("All values have been processed.")
    console.timeEnd("elapsed time")
    killAll()
  },
})

for await (const data of getPagedData({ limit: 100 })) {
  const worker = getWorker()
  worker.send({ data })
}
