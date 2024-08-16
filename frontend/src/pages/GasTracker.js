import { ethers } from "ethers"
import React, { useEffect, useState } from "react"

import { getWeb3 } from "../web3"
import {
  getCurrentUnixTimestampInMs,
  convertUnixTimestampToHumanReadableDate,
} from "../util/date.util"

import globalConst from "../global.const.json"
import votingMasterAbi from "../abi/voting.master.abi.json"

import GasQuote from "../components/GasQuote"

function GasTracker(props) {
  const [gasPrice, setGasPrice] = useState(null)
  const [votingGas, setVotingGas] = useState(null)
  const [voteDelegatingGas, setVoteDelegatingGas] = useState(null)
  const [proposalCreationGas, setProposalCreationGas] = useState(null)
  const [gasLastRefreshedAt, setGasLastRefreshedAt] = useState(null)

  const refreshInterval = 2000
  useEffect(() => {
    const web3 = getWeb3()
    const contract = new ethers.Contract(
      globalConst.VOTING_MASTER_ADDRESS,
      votingMasterAbi,
      web3,
    )

    const fetchData = async () => {
      const [gasPrice, votingGas, proposalCreationGas, voteDelegatingGas] =
        await Promise.all([
          web3.getGasPrice(),
          contract.estimateGas["upVote"](1),
          contract.estimateGas["createProposal"](
            "testing",
            "ciphernova is testing",
            1855292721,
          ),
          contract.estimateGas["delegateVote"](
            "0x08D433754eC29337b8b8eb10b59dd3e503473225",
          ),
        ])

      setGasPrice(gasPrice)
      setVotingGas(votingGas * gasPrice)
      setVoteDelegatingGas(voteDelegatingGas * gasPrice)
      setProposalCreationGas(proposalCreationGas * gasPrice)
      setGasLastRefreshedAt(getCurrentUnixTimestampInMs())
    }

    fetchData()

    const intervalId = setInterval(fetchData, refreshInterval)

    // cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId)
  }, [refreshInterval])

  return (
    <div>
      <h1 className="text-4xl font-bold text-center my-10">GAS TRACKER</h1>

      <div className="flex justify-center">
        <GasQuote
          action={"Last Refreshed At"}
          gasConsumed={
            gasLastRefreshedAt
              ? convertUnixTimestampToHumanReadableDate(gasLastRefreshedAt)
              : "Loading..."
          }
        />
        <GasQuote
          action={"Gas price"}
          gasConsumed={
            gasPrice ? (gasPrice / 10 ** 9).toFixed(2) + " GWEI" : "Loading..."
          }
        />
      </div>
      <div className="flex justify-center">
        <GasQuote
          action={"Gas required to create a proposal"}
          gasConsumed={
            proposalCreationGas
              ? (proposalCreationGas / 10 ** 18).toFixed(5) + " ETH"
              : "Loading ..."
          }
        />
        <GasQuote
          action={"Gas required to vote"}
          gasConsumed={
            votingGas
              ? (votingGas / 10 ** 18).toFixed(5) + " ETH"
              : "Loading ..."
          }
        />
        <GasQuote
          action={"Gas required to delegate vote"}
          gasConsumed={
            voteDelegatingGas
              ? (voteDelegatingGas / 10 ** 18).toFixed(5) + " ETH"
              : "Loading ..."
          }
        />
      </div>
    </div>
  )
}

export default GasTracker
