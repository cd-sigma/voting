import _ from "lodash"

import globalConst from "../global.const"
import { getVotingMasterInstance, getWeb3 } from "./web3.util"

/**
 * @description Get all the proposals from the smart contract
 * @returns {Promise<{id: *,noOfUpVotes: *, name: *, description: *, id: *, noOfDownVotes: *, endTime: *}[]>}
 */
export async function getAllProposals() {
  const web3 = getWeb3()
  const votingMaster = await getVotingMasterInstance(web3)

  const proposalCount = await votingMaster.proposalsCount()
  const proposalFetchingCalls = _.range(0, proposalCount).map((index) =>
    votingMaster.proposals(index),
  )
  let proposals = await Promise.all(proposalFetchingCalls)
  proposals = proposals.map((proposal, index) => {
    return {
      id: index,
      name: proposal.name,
      description: proposal.description,
      noOfUpVotes: proposal.noOfUpVotes.toNumber(),
      noOfDownVotes: proposal.noOfDownVotes.toNumber(),
      endTime: proposal.endTime.toNumber(),
    }
  })
  proposals = _.sortBy(proposals, (proposal) => proposal.endTime)

  return proposals
}

/**
 * @description Get the proposal by id from the smart contract
 * @param proposalId
 * @returns {Promise<{noOfUpVotes: *, name, description, noOfDownVotes: *, endTime: *}>}
 */
export async function getProposalById(proposalId) {
  const web3 = getWeb3()
  const votingMaster = await getVotingMasterInstance(web3)
  const proposal = await votingMaster.proposals(proposalId)

  return {
    name: proposal.name,
    description: proposal.description,
    noOfUpVotes: proposal.noOfUpVotes.toNumber(),
    noOfDownVotes: proposal.noOfDownVotes.toNumber(),
    endTime: proposal.endTime.toNumber(),
  }
}

/**
 * @description Check if the user has voted on a proposal
 * @param {string} account
 * @param {number} proposalId
 * @returns {Promise<boolean>}
 */
export async function hasUserVoted(account, proposalId) {
  const web3 = getWeb3()
  const votingMaster = await getVotingMasterInstance(web3)

  return await votingMaster.hasVoted(account, proposalId)
}

/**
 * @description Checks if the user is a delegatee
 * @param {string} account
 * @returns {Promise<boolean>}
 */
export async function isUserDelegatee(account) {
  const web3 = getWeb3()
  const votingMaster = await getVotingMasterInstance(web3)
  const delegator = await votingMaster.delegators(account)

  return delegator !== globalConst.NULL_ADDRESS
}

/**
 * @description Gets the delegator of the account (delegatee) . In case the account is not a delegatee, it returns null address.
 * @param {string} account
 * @returns {Promise<string>}
 */
export async function getDelegator(account) {
  const web3 = getWeb3()
  const votingMaster = await getVotingMasterInstance(web3)

  return await votingMaster.delegators(account)
}

/**
 * @description Gets the delegatee of the account (delegator) . In case the account is not a delegator, it returns null address.
 * @param {string} account
 * @returns {Promise<string>}
 */
export async function getDelegatee(account) {
  const web3 = getWeb3()
  const votingMaster = await getVotingMasterInstance(web3)

  return await votingMaster.delegatees(account)
}

/**
 * @description Get the voting power of the account. It is derived from the balance of the account (1 ETH = 1 voting power)
 * @param {string} account
 * @returns {Promise<number>}
 */
export async function getVotingPower(account) {
  const web3 = getWeb3()
  const balance = await web3.getBalance(account)

  return Math.floor(balance / 10 ** 18)
}
