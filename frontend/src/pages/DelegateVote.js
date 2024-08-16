import React, { useState } from "react"

function DelegateVote(props) {
  const [delegateAddress, setDelegateAddress] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    //TODO: add code for web3 call here
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-20">
      <h2 className="text-2xl font-bold mb-4 text-black">
        Delegate Your Voting Power
      </h2>
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
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded hover:bg-gray-600 transition duration-300"
        >
          Delegate Voting Power
        </button>
      </form>
    </div>
  )
}

export default DelegateVote
