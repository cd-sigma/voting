import React, { useEffect, useState } from "react"

import { getWeb3 } from "../util/web3.util"
import {
  getCurrentUnixTimestampInMs,
  convertUnixTimestampToHumanReadableDate,
} from "../util/date.util"

import globalConst from "../global.const.json"
import GasQuote from "../components/GasQuote"

function GasTracker(props) {
  const [gasPrice, setGasPrice] = useState(null)
  const [votingGas, setVotingGas] = useState(null)
  const [voteDelegatingGas, setVoteDelegatingGas] = useState(null)
  const [proposalCreationGas, setProposalCreationGas] = useState(null)
  const [gasLastRefreshedAt, setGasLastRefreshedAt] = useState(null)

  useEffect(() => {
    const web3 = getWeb3()

    const fetchData = async () => {
      const gasPrice = await web3.getGasPrice()

      setGasPrice(gasPrice)
      setVotingGas(globalConst.VOTING_GAS_UNITS_CONSUMED * gasPrice)
      setVoteDelegatingGas(
        globalConst.VOTE_DELEGATION_GAS_UNITS_CONSUMED * gasPrice,
      )
      setProposalCreationGas(
        globalConst.PROPOSAL_CREATION_GAS_UNITS_CONSUMED * gasPrice,
      )
      setGasLastRefreshedAt(getCurrentUnixTimestampInMs())
    }

    fetchData()

    const intervalId = setInterval(fetchData, 2000)

    // cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId)
  }, [])

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
            gasPrice ? (gasPrice / 10 ** 9).toFixed(3) + " GWEI" : "Loading..."
          }
        />
      </div>
      <div className="flex justify-center">
        <GasQuote
          action={"Gas required to create a proposal"}
          gasConsumed={
            proposalCreationGas
              ? (proposalCreationGas / 10 ** 18).toFixed(7) + " ETH"
              : "Loading ..."
          }
        />
        <GasQuote
          action={"Gas required to vote"}
          gasConsumed={
            votingGas
              ? (votingGas / 10 ** 18).toFixed(7) + " ETH"
              : "Loading ..."
          }
        />
        <GasQuote
          action={"Gas required to delegate vote"}
          gasConsumed={
            voteDelegatingGas
              ? (voteDelegatingGas / 10 ** 18).toFixed(7) + " ETH"
              : "Loading ..."
          }
        />
      </div>
    </div>
  )
}

export default GasTracker
