const ethers = require("ethers")

const config = require("../config.json")
const globalConst = require("../global.const.json")
const globalKeysEnum = require("../enum/global.keys.enum")

const votingMasterAbi = require("../abi/voting.master.abi.json")

/**
 * @description Checks if web3 instance is initialised
 * @returns {boolean}
 */
export function isWeb3Initialised() {
  return global[globalKeysEnum.WEB3] !== undefined
}

/**
 * @description Returns the web3 instance
 * @returns {Object}
 */
export function getWeb3() {
  if (!isWeb3Initialised()) {
    global[globalKeysEnum.WEB3] = new ethers.providers.JsonRpcProvider(
      config.rpcUrl,
    )
  }
  return global[globalKeysEnum.WEB3]
}

/**
 * @description Checks if window provider is available. This is used to check if metamask is installed
 * @returns {boolean}
 */
export function isWindowProviderAvailable() {
  return window.ethereum !== undefined
}

/**
 * @description Returns the window provider
 * @returns {Object}
 */
export function getWindowProvider() {
  if (!isWindowProviderAvailable()) {
    throw new Error("Window provider not available")
  }
  return new ethers.providers.Web3Provider(window.ethereum)
}

/**
 * @description Returns the chain id of the connected network
 * @returns {Promise<number>}
 */
export async function getWindowProviderChainId() {
  if (!isWindowProviderAvailable()) {
    throw new Error("Window provider not available")
  }

  const provider = getWindowProvider()
  const network = await provider.getNetwork()

  return network.chainId
}

/**
 * @description Checks if accounts are available in the window provider. This is used to check if the wallet is unlocked or not.
 * @returns {Promise<boolean>}
 */
export async function isWindowProviderAccountsAvailable() {
  if (isWindowProviderAvailable()) {
    const provider = getWindowProvider()

    let accounts = await provider.listAccounts()

    return accounts.length > 0
  } else {
    alert("Please install metamask to continue")
  }
}

/**
 * @description Returns the address of the connected wallet
 * @returns {Promise<string>}
 */
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

/**
 * @description Returns the voting master contract instance
 * @param {Object} provider
 * @returns {Object}
 */
export function getVotingMasterInstance(provider) {
  return new ethers.Contract(
    globalConst.VOTING_MASTER_ADDRESS,
    votingMasterAbi,
    provider,
  )
}
