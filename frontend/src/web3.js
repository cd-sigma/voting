const ethers = require("ethers")

const config = require("./config")
const globalKeysEnum = require("./enum/global.keys.enum")

function isWeb3Initialised() {
  return global[globalKeysEnum.WEB3] !== undefined
}

function getWeb3() {
  if (!isWeb3Initialised()) {
    global[globalKeysEnum.WEB3] = new ethers.providers.JsonRpcProvider(
      config.rpcUrl,
    )
  }
  return global[globalKeysEnum.WEB3]
}

function isWindowProviderInitialised() {
  return global[globalKeysEnum.WINDOW_PROVIDER] !== undefined
}

function setWindowProvider(provider) {
  global[globalKeysEnum.WINDOW_PROVIDER] = new ethers.providers.Web3Provider(
    provider,
  )
}

function getWindowProvider() {
  if (!isWindowProviderInitialised()) {
    throw new Error("Window provider not initialised")
  }
  return global[globalKeysEnum.WINDOW_PROVIDER]
}

module.exports = {
  isWeb3Initialised: isWeb3Initialised,
  getWeb3: getWeb3,
  isWindowProviderInitialised: isWindowProviderInitialised,
  getWindowProvider: getWindowProvider,
  setWindowProvider: setWindowProvider,
}
