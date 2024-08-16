import _ from "lodash"
import { ethers } from "ethers"
import React, { useEffect, useState } from "react"

import Proposal from "../components/Proposal"
import Loader from "../components/Loader"

import { getWeb3 } from "../web3"

import globalConst from "../global.const.json"
import votingMasterAbi from "../abi/voting.master.abi.json"

const PROPOSAL_FETCHING_BATCH_SIZE = 10

function Proposals(props) {
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const web3 = getWeb3()
        const votingMaster = new ethers.Contract(
          globalConst.VOTING_MASTER_ADDRESS,
          votingMasterAbi,
          web3,
        )

        const proposalCount = await votingMaster.proposalsCount()
        const fetchProposalsTill = Math.min(
          proposalCount.toNumber(),
          PROPOSAL_FETCHING_BATCH_SIZE,
        )
        const proposalFetchingCalls = _.range(0, fetchProposalsTill).map(
          (index) => votingMaster.proposals(index),
        )
        const proposals = await Promise.all(proposalFetchingCalls)

        setProposals(proposals)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setError(error.message)
        setLoading(false)
      }
    }

    fetchProposals()
  }, [])
  return (
    <div>
      <div className="m-[30px]">
        <h1 className="text-4xl font-bold text-center">Proposals</h1>
        {loading && <Loader />}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <div className="flex flex-wrap">
            {proposals.map((proposal, index) => (
              <Proposal
                id={index}
                name={proposal.name}
                description={proposal.description}
                noOfUpVotes={proposal.noOfUpVotes.toString()}
                noOfDownVotes={proposal.noOfDownVotes.toString()}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Proposals
