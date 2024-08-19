/**
 * @description Get the current Unix timestamp in milliseconds
 * @returns {number}
 */
export function getCurrentUnixTimestampInMs() {
  return Date.now()
}

/**
 * @description Convert a Unix timestamp to a human-readable date
 * @param {number} unixTimestamp
 * @returns {string}
 */
export function convertUnixTimestampToHumanReadableDate(unixTimestamp) {
  return new Date(unixTimestamp).toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  })
}

/**
 * @description Get the unix timestamp in seconds n days from now
 * @param {number} n
 * @returns {number}
 */
export function getNDaysFromNowUnixTimestampInSecs(n) {
  const currentTimeInSecs = Date.now() / 1000
  return Math.floor(currentTimeInSecs + n * 24 * 60 * 60)
}

/**
 * @description Check if a timestamp is in the past
 * @param {number} timestampInSecs
 * @returns {boolean}
 */
export function isTimeInPast(timestampInSecs) {
  return timestampInSecs < Date.now() / 1000
}

/**
 * @description Get the time remaining until a timestamp
 * @param {number} timestampInSecs
 * @returns {string}
 */
export function getTimeRemaining(timestampInSecs) {
  const currentTimeInSecs = Date.now() / 1000
  const timeDifference = timestampInSecs - currentTimeInSecs
  if (timeDifference <= 0) {
    throw new Error("Time is in the past")
  }

  const days = Math.floor(timeDifference / (60 * 60 * 24))
  const hours = Math.floor((timeDifference / (60 * 60)) % 24)
  const minutes = Math.floor((timeDifference / 60) % 60)

  return `${days}d ${hours}h ${minutes}m`
}
