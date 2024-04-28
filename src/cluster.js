import { fork } from "node:child_process"

const CHILDREN = new Map()
const WORKERS = []

/**
 * returns next child process (round robin)
 */
function getNextWorker() {
  let index = 0

  return () => {
    if (index > WORKERS.length - 1) index = 0
    return WORKERS[index++]
  }
}

/**
 * end all child process
 */
function killAll() {
  console.log("terminating all workers...")
  WORKERS.forEach((worker) => process.kill(worker.pid))
}

export function initCluster({
  maxWorkers = 2,
  script = "src/task.js",
  onTaskDone = (count) => {},
}) {
  let tasksDone = 0

  console.log(`Preparing ${maxWorkers} workers...`)

  for (let i = 0; i < maxWorkers; i++) {
    const child = fork(script)

    // listen child process events
    child
      .on("message", (data) => {
        if (typeof data === "number") {
          tasksDone++
          onTaskDone(tasksDone)
          return
        }

        console.log(data)
      })
      .on("close", () => {
        console.log(`Worker [${child.pid}] has been closed.`)
      })
      .on("error", (err) => {
        console.log(`An error occurred on worker [${child.pid}]\n`, err)
        process.kill(child.pid)
      })

    CHILDREN.set(child.pid, child)
  }

  WORKERS.push(...CHILDREN.values())

  return { getWorker: getNextWorker(), killAll }
}
