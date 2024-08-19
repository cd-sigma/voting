/**
 * @description Check if the given string is a valid Ethereum address
 * @param address
 * @returns {boolean}
 */
export function isEthereumAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}
