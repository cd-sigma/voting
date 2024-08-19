export function getCurrentUnixTimestampInMs() {
  return Date.now()
}

export function convertUnixTimestampToHumanReadableDate(unixTimestamp) {
  return new Date(unixTimestamp).toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  })
}

export function getNDaysFromNowUnixTimestampInSecs(n) {
  const currentTimeInSecs = Date.now() / 1000
  return Math.floor(currentTimeInSecs + n * 24 * 60 * 60)
}

export function isTimeInPast(timestampInSecs) {
  return timestampInSecs < Date.now() / 1000
}

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
