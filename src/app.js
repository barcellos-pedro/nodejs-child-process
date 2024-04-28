import { seedDatabase, getPagedData } from "./database.js"
import { initCluster } from "./cluster.js"
import { threadCount } from "./helpers.js"

const totalEntries = 1_000
const maxWorkers = threadCount
const limit = Math.round(totalEntries / maxWorkers)

seedDatabase(totalEntries)

console.time("elapsed time")

const { getWorker, killAll } = initCluster({
  maxWorkers,
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

for await (const data of getPagedData({ limit })) {
  const worker = getWorker()
  console.log(`Sending task to worker: [${worker.pid}]`)
  worker.send({ data })
}
