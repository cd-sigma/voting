const ethers = require("ethers")

const config = require("../config.json")
const globalConst = require("../global.const.json")
const globalKeysEnum = require("../enum/global.keys.enum")

const votingMasterAbi = require("../abi/voting.master.abi.json")

export function isWeb3Initialised() {
  return global[globalKeysEnum.WEB3] !== undefined
}

export function getWeb3() {
  if (!isWeb3Initialised()) {
    global[globalKeysEnum.WEB3] = new ethers.providers.JsonRpcProvider(
      config.rpcUrl,
    )
  }
  return global[globalKeysEnum.WEB3]
}

export function isWindowProviderAvailable() {
  return window.ethereum !== undefined
}

export function getWindowProvider() {
  if (!isWindowProviderAvailable()) {
    throw new Error("Window provider not available")
  }
  return new ethers.providers.Web3Provider(window.ethereum)
}

export async function isWindowProviderAccountsAvailable() {
  if (isWindowProviderAvailable()) {
    const provider = getWindowProvider()

    let accounts = await provider.listAccounts()

    return accounts.length > 0
  } else {
    alert("Please install metamask to continue")
  }
}

export async function getWindowProviderAccount() {
  if (!isWindowProviderAvailable()) {
    throw new Error("Metamask not installed")
  }

  if (!(await isWindowProviderAccountsAvailable())) {
    throw new Error("Wallet not connected")
  }

  const provider = getWindowProvider()
  const accounts = await provider.listAccounts()
  if (accounts.length === 0) {
    throw new Error("Wallet not connected!")
  }

  return accounts[0]
}

export function getVotingMasterInstance(provider) {
  return new ethers.Contract(
    globalConst.VOTING_MASTER_ADDRESS,
    votingMasterAbi,
    provider,
  )
}
