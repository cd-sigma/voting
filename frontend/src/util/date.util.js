function getCurrentUnixTimestampInMs() {
  return Date.now()
}

function convertUnixTimestampToHumanReadableDate(unixTimestamp) {
  return new Date(unixTimestamp).toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  })
}

module.exports = {
  getCurrentUnixTimestampInMs: getCurrentUnixTimestampInMs,
  convertUnixTimestampToHumanReadableDate: convertUnixTimestampToHumanReadableDate,
}