import { isMainThread } from "node:worker_threads"

import { sleep } from "./helpers.js"
import { getLogger } from "./helpers.js"
const log = getLogger(process.pid)

log("initialized")
log("isMainThread? " + isMainThread)

/**
 * Fake processing...
 */
async function processTask(data) {
  await sleep()
  return data
}

// work on values received from parent process
process.on("message", (data) => {
  const taks = []

  for (const value of data) {
    log(`will process item: ${value.id}`)

    const task = processTask(value)
      .then((result) => {
        log(`item ${result.id} done`)
        process.send(1)
      })
      .catch(() => {
        log(`error processing task: ${value.id}`)
      })

    taks.push(task)
  }

  Promise.all(taks).then(() => {
    process.send(`[${process.pid}] all tasks done.`)
    process.kill(0)
  })
})
