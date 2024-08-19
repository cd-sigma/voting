import _ from "lodash"
import React, { useState } from "react"

import {
  getVotingMasterInstance,
  getWindowProvider,
  isWindowProviderAvailable,
} from "../util/web3.util"
import { getNDaysFromNowUnixTimestampInSecs } from "../util/date.util"

import proposalVoteDurEnum from "../enum/proposal.vote.dur.enum"

function CreateProposal(props) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState(1)
  const [createButtonMessage, setCreateButtonMessage] =
    useState("Create Proposal")
  const [isProposalCreated, setIsProposalCreated] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (_.isEmpty(name) || _.isEmpty(description)) {
      alert("Please fill all the fields.")
      return
    }

    if (isWindowProviderAvailable()) {
      const provider = getWindowProvider()
      const votingMasterInstance = getVotingMasterInstance(
        provider.getSigner(0),
      )

      try {
        setCreateButtonMessage("Approving Transaction...")
        const { hash } = await votingMasterInstance.createProposal(
          name,
          description,
          getNDaysFromNowUnixTimestampInSecs(duration),
        )
        setCreateButtonMessage("Waiting for Transaction to be Mined...")
        await provider.waitForTransaction(hash)
        setCreateButtonMessage("Proposal successfully created ✅")
        setIsProposalCreated(true)
      } catch (error) {
        console.log(error)
        setCreateButtonMessage("Some error occurred. Please try again.")
      }
    } else {
      alert("Please connect wallet to continue.")
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-20">
      <h2 className="text-2xl font-bold mb-4 text-black">Create a Proposal</h2>
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="address"
          className="block text-gray-700 font-semibold mb-2"
        >
          Name of the proposal:
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Name"
          className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
        />
        <label
          htmlFor="description"
          className="block text-gray-700 font-semibold mb-2"
        >
          Description of the proposal:
        </label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter Description"
          className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
        />
        <label
          htmlFor="expiry"
          className="block text-gray-700 font-semibold mb-2"
        >
          Select Duration:
        </label>
        <select
          id="expiry"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
        >
          {Object.keys(proposalVoteDurEnum).map((key) => (
            <option key={key} value={key}>
              {proposalVoteDurEnum[key]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded hover:bg-gray-600 transition duration-300 mb-5"
        >
          {createButtonMessage}
        </button>
      </form>
      {isProposalCreated && (
        <a href="/proposals">
          <button className="w-full bg-black text-white p-2 rounded hover:bg-gray-600 transition duration-300">
            View Proposals
          </button>
        </a>
      )}
    </div>
  )
}

export default CreateProposal
