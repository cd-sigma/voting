function getNOldDaysUnixTimestamp(n) {
  return Math.floor(Date.now() / 1000) - 86400 * n
}

function getNSecondsFromNowUnixTimestamp(n) {
  return Math.floor(Date.now() / 1000) + n
}

function getNDaysFromNowUnixTimestamp(n) {
  return Math.floor(Date.now() / 1000) + 86400 * n
}

module.exports = {
  getNOldDaysUnixTimestamp: getNOldDaysUnixTimestamp,
  getNSecondsFromNowUnixTimestamp: getNSecondsFromNowUnixTimestamp,
  getNDaysFromNowUnixTimestamp: getNDaysFromNowUnixTimestamp,
}
