import { seedDatabase, getPagedData } from "./database.js"
import { initCluster } from "./cluster.js"

seedDatabase()

const clusterProps = {
  maxWorkers: 2,
  script: "src/task.js",
  onTaskDone(count) {
    console.log(`tasks done: ${count}`)
  },
}

const { getWorker, killAll } = initCluster(clusterProps)

for await (const data of getPagedData()) {
  const worker = getWorker()
  worker.send(data)
}
