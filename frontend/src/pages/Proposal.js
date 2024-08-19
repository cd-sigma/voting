import React, { useEffect, useState } from "react"

import {
  getProposalById,
  hasUserVoted,
  isUserDelegatee,
  getVotingPower,
  getDelegator,
} from "../util/voting.util"
import { isTimeInPast, getTimeRemaining } from "../util/date.util"
import {
  getVotingMasterInstance,
  getWindowProvider,
  getWindowProviderAccount,
} from "../util/web3.util"
import proposalActionEnum from "../enum/proposal.action.enum"

import Loader from "../components/Loader"

function Proposal(props) {
  const [user, setUser] = useState("")
  const [proposal, setProposal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [action, setAction] = useState({})

  useEffect(() => {
    const fetchProposal = async () => {
      const account = await getWindowProviderAccount()
      const [proposal, hasVoted, isDelegatee, votingPower, delegator] =
        await Promise.all([
          getProposalById(props.match.params.proposalId),
          hasUserVoted(account, props.match.params.proposalId),
          isUserDelegatee(account),
          getVotingPower(account),
          getDelegator(account),
        ])

      setProposal({
        ...proposal,
        isExpired: isTimeInPast(proposal.endTime),
      })
      setUser({
        account,
        hasVoted,
        isDelegatee,
        votingPower,
        delegator,
      })
      setLoading(false)
    }

    fetchProposal()
  }, [props.match.params.proposalId])

  const handleUpVote = async () => {
    setAction({
      type: proposalActionEnum.UP_VOTE,
      isOnGoing: true,
      error: null,
    })
    const provider = await getWindowProvider()
    const votingMasterInstance = await getVotingMasterInstance(
      provider.getSigner(0),
    )

    try {
      const { hash } = await votingMasterInstance.upVote(
        props.match.params.proposalId,
      )
      await provider.waitForTransaction(hash)
      setProposal((proposal) => ({
        ...proposal,
        noOfUpVotes: proposal.noOfUpVotes + user.votingPower,
      }))
      setUser((user) => ({
        ...user,
        hasVoted: true,
      }))
      setAction({
        type: proposalActionEnum.UP_VOTE,
        isOnGoing: false,
        error: null,
      })
    } catch (error) {
      console.log(error)
      setAction({
        type: proposalActionEnum.UP_VOTE,
        isOnGoing: false,
        error,
      })
    }
  }

  const handleDownVote = async () => {
    setAction({
      type: proposalActionEnum.DOWN_VOTE,
      isOnGoing: true,
      error: null,
    })
    const provider = await getWindowProvider()
    const votingMasterInstance = await getVotingMasterInstance(
      provider.getSigner(0),
    )

    try {
      const { hash } = await votingMasterInstance.downVote(
        props.match.params.proposalId,
      )
      await provider.waitForTransaction(hash)
      setProposal((proposal) => ({
        ...proposal,
        noOfDownVotes: proposal.noOfDownVotes + user.votingPower,
      }))
      setUser((user) => ({
        ...user,
        hasVoted: true,
      }))
      setAction({
        type: proposalActionEnum.DOWN_VOTE,
        isOnGoing: false,
        error: null,
      })
    } catch (error) {
      console.log(error)
      setAction({
        type: proposalActionEnum.DOWN_VOTE,
        isOnGoing: false,
        error,
      })
    }
  }

  const handleUpVoteByDelegate = async () => {
    setAction({
      type: proposalActionEnum.UP_VOTE_BY_DELEGATE,
      isOnGoing: true,
      error: null,
    })
    const provider = await getWindowProvider()
    const votingMasterInstance = await getVotingMasterInstance(
      provider.getSigner(0),
    )

    try {
      const { hash } = await votingMasterInstance.upVoteByDelegate(
        props.match.params.proposalId,
      )
      await provider.waitForTransaction(hash)
      setProposal((proposal) => ({
        ...proposal,
        noOfUpVotes: proposal.noOfUpVotes + user.votingPower,
      }))
      setUser((user) => ({
        ...user,
        hasVoted: true,
      }))
      setAction({
        type: proposalActionEnum.UP_VOTE_BY_DELEGATE,
        isOnGoing: false,
        error: null,
      })
    } catch (error) {
      console.log(error)
      setAction({
        type: proposalActionEnum.UP_VOTE_BY_DELEGATE,
        isOnGoing: false,
        error,
      })
    }
  }

  const handleDownVoteByDelegate = async () => {
    setAction({
      type: proposalActionEnum.DOWN_VOTE_BY_DELEGATE,
      isOnGoing: true,
      error: null,
    })
    const provider = await getWindowProvider()
    const votingMasterInstance = await getVotingMasterInstance(
      provider.getSigner(0),
    )

    try {
      const { hash } = await votingMasterInstance.upVoteByDelegate(
        props.match.params.proposalId,
      )
      await provider.waitForTransaction(hash)
      setProposal((proposal) => ({
        ...proposal,
        noOfDownVotes: proposal.noOfDownVotes + user.votingPower,
      }))
      setUser((user) => ({
        ...user,
        hasVoted: true,
      }))
      setAction({
        type: proposalActionEnum.DOWN_VOTE_BY_DELEGATE,
        isOnGoing: false,
        error: null,
      })
    } catch (error) {
      console.log(error)
      setAction({
        type: proposalActionEnum.DOWN_VOTE_BY_DELEGATE,
        isOnGoing: false,
        error,
      })
    }
  }

  return (
    <div className="m-10">
      {loading && <Loader />}
      {proposal && (
        <div>
          <h1 className="text-5xl font-bold mb-4">{proposal.name}</h1>
          <p className="text-2xl text-gray-700 mb-4">{proposal.description}</p>
          <div className="text-xl">Upvotes: {proposal.noOfUpVotes}</div>
          <div className="text-xl">Downvotes: {proposal.noOfDownVotes}</div>
          <div className="text-xl">
            Time Left: {getTimeRemaining(proposal.endTime)}
          </div>

          {proposal.isExpired && (
            <div className="text-xl mt-5">
              {proposal.noOfUpVotes.toNumber() >
              proposal.noOfDownVotes.toNumber()
                ? "Proposal Passed ✅"
                : "Proposal Rejected ❌"}
            </div>
          )}

          {user.hasVoted && (
            <div className="text-xl mt-5 text-red-600">
              You have already voted on this proposal
            </div>
          )}

          {!user.hasVoted && !proposal.isExpired && (
            <div>
              <h2 className="mt-5">
                Connected Account:{" "}
                <span className="font-bold text-blue-500">{user.account}</span>
              </h2>
              <h2 className="mb-5 ">
                Voting Power:{" "}
                <span className="font-bold text-blue-500">
                  {user.votingPower}
                </span>
              </h2>

              {user.isDelegatee && (
                <h2 className="mb-5 ">
                  You can also vote on behalf of:{" "}
                  <span className="font-bold text-blue-500">
                    {user.delegator}
                  </span>
                </h2>
              )}

              <div className="mt-20 mb-10 space-x-10">
                <button
                  onClick={handleUpVote}
                  disbaled={action.isOnGoing}
                  className={`bg-white hover:bg-gray-500 text-black font-bold py-2 px-4`}
                >
                  {action.type === proposalActionEnum.UP_VOTE &&
                  action.isOnGoing
                    ? "Sending Transaction..."
                    : action.error
                      ? "Some Error occurred!"
                      : "Upvote"}
                </button>
                <button
                  onClick={handleDownVote}
                  disabled={action.isOnGoing}
                  className={`bg-white hover:bg-gray-500 text-black font-bold py-2 px-4`}
                >
                  {action.type === proposalActionEnum.DOWN_VOTE &&
                  action.isOnGoing
                    ? "Sending Transaction..."
                    : action.error
                      ? "Some Error occurred!"
                      : "Downvote"}
                </button>
              </div>
            </div>
          )}

          {!user.hasVoted && !proposal.isExpired && user.isDelegatee && (
            <div className="space-x-10">
              <button
                onClick={handleUpVoteByDelegate}
                disabled={action.isOnGoing}
                className={`bg-white hover:bg-gray-500 text-black font-bold py-2 px-4`}
              >
                {action.type === proposalActionEnum.UP_VOTE_BY_DELEGATE &&
                action.isOnGoing
                  ? "Sending Transaction..."
                  : action.error
                    ? "Some Error occurred!"
                    : "Upvote By Delegate"}
              </button>
              <button
                onClick={handleDownVoteByDelegate}
                disabled={action.isOnGoing}
                className={`bg-white hover:bg-gray-500 text-black font-bold py-2 px-4`}
              >
                {action.type === proposalActionEnum.DOWN_VOTE_BY_DELEGATE &&
                action.isOnGoing
                  ? "Sending Transaction..."
                  : action.error
                    ? "Some Error occurred!"
                    : "Downvote By Delegate"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Proposal
