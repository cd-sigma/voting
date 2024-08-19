import React, { useEffect, useState } from "react"

import Proposal from "../components/Proposal"
import Loader from "../components/Loader"

import { getWindowProvider, isWindowProviderAvailable } from "../util/web3.util"
import { isTimeInPast } from "../util/date.util"
import { getAllProposals } from "../util/voting.util"

import proposalFilterEnum from "../enum/proposal.filter.enum.js"

function Proposals(props) {
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState("")
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState(proposalFilterEnum.ALL)

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        //TODO: add pagination while fetching proposals (to paginate on open/closed proposals, we will need to store open/closed proposals separately in the contract)
        const proposals = await getAllProposals()
        setProposals(proposals)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setError(error.message)
        setLoading(false)
      }
    }

    const checkWallet = async () => {
      if (isWindowProviderAvailable()) {
        const provider = await getWindowProvider()

        let accounts = await provider.listAccounts()
        if (accounts.length === 0) {
          accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          })
        }
        setAccount(accounts[0])
      } else {
        alert("Please install Metamask to continue")
      }
    }

    Promise.all([fetchProposals(), checkWallet()])
  }, [])

  const handleFilterChange = async (e) => {
    setFilter(e.target.value)
    setLoading(true)

    let proposals = []
    switch (e.target.value) {
      case proposalFilterEnum.ALL:
        proposals = await getAllProposals()
        setProposals(proposals)
        break
      case proposalFilterEnum.ACTIVE:
        proposals = await getAllProposals()
        setProposals(
          proposals.filter((proposal) => !isTimeInPast(proposal.endTime)),
        )
        break
      case proposalFilterEnum.EXPIRED:
        proposals = await getAllProposals()
        setProposals(
          proposals.filter((proposal) => isTimeInPast(proposal.endTime)),
        )
        break
      default:
        console.log("Invalid filter")
    }
    setLoading(false)
  }

  return (
    <div>
      <div className="m-[30px]">
        <div className="flex justify-between p-5">
          <h1 className="text-4xl font-bold">Proposals</h1>
          <div>
            <select
              id="filter"
              value={filter}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded text-black"
            >
              {Object.keys(proposalFilterEnum).map((key) => (
                <option key={key} value={proposalFilterEnum[key]}>
                  {proposalFilterEnum[key]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && <Loader />}
        {error && <p>Some error occurred: {error}</p>}
        {!loading && !error && (
          <div className="flex flex-wrap">
            {proposals.length === 0 ? (
              <p className="text-red-600 m-5">No proposals found</p>
            ) : (
              proposals.map((proposal, index) => (
                <Proposal
                  id={proposal.id}
                  account={account}
                  name={proposal.name}
                  description={proposal.description}
                  endTime={proposal.endTime}
                  noOfUpVotes={proposal.noOfUpVotes}
                  noOfDownVotes={proposal.noOfDownVotes}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Proposals
