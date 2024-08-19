import React, { useState } from "react"

import {
  getWindowProvider,
  isWindowProviderAvailable,
  getVotingMasterInstance,
} from "../util/web3.util"
import { isEthereumAddress } from "../util/validator.util"

function DelegateVote(props) {
  const [delegateAddress, setDelegateAddress] = useState("")
  const [delegateButtonMessage, setDelegateButtonMessage] = useState("Delegate")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isEthereumAddress(delegateAddress)) {
      alert("Please enter a valid Ethereum address.")
      return
    }

    if (isWindowProviderAvailable()) {
      const provider = getWindowProvider()
      const votingMasterInstance = getVotingMasterInstance(
        provider.getSigner(0),
      )

      try {
        setDelegateButtonMessage("Approving Transaction...")
        const { hash } =
          await votingMasterInstance.delegateVote(delegateAddress)
        setDelegateButtonMessage("Waiting for Transaction to be Mined...")
        await provider.waitForTransaction(hash)
        setDelegateButtonMessage("Vote successfully delegated ✅")
      } catch (error) {
        console.log(error)
        setDelegateButtonMessage("Some error occurred. Please try again.")
      }
    } else {
      alert("Please connect wallet to continue.")
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-20">
      <h2 className="text-2xl font-bold mb-4 text-black">
        Delegate Your Voting Power
      </h2>
      <h3 className="text-black mb-5">
        You can delegate your voting power to another address. This will allow
        the address to vote on your behalf. Once your delegated address has
        voted on a proposal, you will not be able to vote on the same proposal.
      </h3>
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="address"
          className="block text-gray-700 font-semibold mb-2"
        >
          Delegate to Address:
        </label>
        <input
          type="text"
          id="address"
          value={delegateAddress}
          onChange={(e) => setDelegateAddress(e.target.value)}
          placeholder="Enter Ethereum address"
          className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
        />
        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded hover:bg-gray-600 transition duration-300"
        >
          {delegateButtonMessage}
        </button>
      </form>
    </div>
  )
}

export default DelegateVote
