import React, { useEffect, useState } from "react"

import {
  getWeb3,
  getWindowProviderAccount,
  isWindowProviderAvailable,
  isWindowProviderAccountsAvailable,
} from "../util/web3.util"
import { getDelegator, getDelegatee } from "../util/voting.util"

import globalConst from "../global.const"

function Landing(props) {
  const [user, setUser] = useState({})
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [isConnectLoading, setIsConnectLoading] = useState(false)

  const connectWallet = async () => {
    if (!isWindowProviderAvailable()) {
      alert("Please install Metamask to continue")
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    })
    await initialiseUser(accounts[0])
    setIsWalletConnected(true)
  }

  const initialiseUser = async (account) => {
    setIsConnectLoading(true)

    const web3 = getWeb3()
    const balance = await web3.getBalance(account)

    const [delegator, delegatee] = await Promise.all([
      getDelegator(account),
      getDelegatee(account),
    ])

    setUser({
      account,
      balance: (balance / 10 ** 18).toFixed(3),
      votingPower: Math.floor(balance / 10 ** 18),
      delegator,
      delegatee,
      isDelegator: delegatee !== globalConst.NULL_ADDRESS,
      isDelegatee: delegator !== globalConst.NULL_ADDRESS,
    })
    setIsConnectLoading(false)
  }

  useEffect(() => {
    const checkWallet = async () => {
      if (!isWindowProviderAvailable()) {
        alert("Please install Metamask to continue")
      }

      if (await isWindowProviderAccountsAvailable()) {
        const account = await getWindowProviderAccount()
        await initialiseUser(account)
        setIsWalletConnected(true)
      }
    }

    checkWallet()
  }, [])

  return (
    <div>
      {isWalletConnected ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold mt-40 mb-5">
            Welcome to the voting portal.
          </h1>
          <h2 className="mb-5 ">
            Connected Account:{" "}
            <span className="font-bold text-blue-500">{user.account}</span>
          </h2>

          {user.isDelegator && (
            <h2 className="mb-5 ">
              You have delegated your voting power to:{" "}
              <span className="font-bold text-blue-500">{user.delegatee}</span>
            </h2>
          )}
          {user.isDelegatee && (
            <h2 className="mb-5 ">
              You have been delegated by:{" "}
              <span className="font-bold text-blue-500">{user.delegator}</span>
            </h2>
          )}

          <h2 className="mb-20 ">
            Voting Power:{" "}
            <span className="font-bold text-blue-500 font-sans">
              {user.votingPower} ({user.balance} ETH)
            </span>
          </h2>

          <div className="space-x-10">
            <a href="/proposals">
              <button className="bg-white hover:bg-gray-500 text-black font-bold py-2 px-4">
                View Proposals
              </button>
            </a>
            <a href="/delegate-vote">
              <button className="bg-white hover:bg-gray-500 text-black font-bold py-2 px-4">
                Delegate Voting Power
              </button>
            </a>
            <a href="/create-proposal">
              <button className="bg-white hover:bg-gray-500 text-black font-bold py-2 px-4">
                Create Proposal
              </button>
            </a>
            <a href="/gas-tracker">
              <button className="bg-white hover:bg-gray-500 text-black font-bold py-2 px-4">
                Gas Tracker
              </button>
            </a>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-4xl font-bold mt-40 mb-20">
            Connect wallet to continue
          </h1>
          <button
            className="bg-white hover:bg-gray-500 text-black font-bold py-2 px-4"
            onClick={connectWallet}
          >
            {isConnectLoading ? "Connecting..." : "Connect Wallet"}
          </button>
        </div>
      )}
    </div>
  )
}

export default Landing
