import { seedDatabase, getPagedData } from "./database.js"
import { initCluster } from "./cluster.js"

const databaseProps = {
  seedCount: 60,
  limit: 15,
}

seedDatabase(databaseProps.seedCount)

const clusterProps = {
  maxWorkers: 2,
  script: "src/task.js",
  onTaskDone(count) {
    if (count == databaseProps.seedCount) {
      console.log("All tasks done")
      killAll()
    }
  },
}

const { getWorker, killAll } = initCluster(clusterProps)

for await (const data of getPagedData(databaseProps.limit)) {
  const worker = getWorker()
  worker.send(data)
}
