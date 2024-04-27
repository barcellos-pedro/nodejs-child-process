export const sleep = (ms = 1_000) => new Promise((res) => setTimeout(res, ms))

export const getLogger = (identifier) => {
  return (message) => console.log(`[${identifier}] ${message}`)
}
