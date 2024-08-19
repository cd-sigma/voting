import _ from "lodash"

import globalConst from "../global.const"
import { getVotingMasterInstance, getWeb3 } from "./web3.util"

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

export async function hasUserVoted(account, proposalId) {
  const web3 = getWeb3()
  const votingMaster = await getVotingMasterInstance(web3)

  return await votingMaster.hasVoted(account, proposalId)
}

export async function isUserDelegatee(account) {
  const web3 = getWeb3()
  const votingMaster = await getVotingMasterInstance(web3)
  const delegator = await votingMaster.delegators(account)

  return delegator !== globalConst.NULL_ADDRESS
}

export async function getDelegator(account) {
  const web3 = getWeb3()
  const votingMaster = await getVotingMasterInstance(web3)

  return await votingMaster.delegators(account)
}

export async function getDelegatee(account) {
  const web3 = getWeb3()
  const votingMaster = await getVotingMasterInstance(web3)

  return await votingMaster.delegatees(account)
}

export async function getVotingPower(account) {
  const web3 = getWeb3()
  const balance = await web3.getBalance(account)

  return Math.floor(balance / 10 ** 18)
}
