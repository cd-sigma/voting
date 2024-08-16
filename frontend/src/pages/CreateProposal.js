import React, { useState } from "react"

function CreateProposal(props) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    //TODO: add code for web3 call here
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
          <option value="1">1 Day</option>
          <option value="2">2 Days</option>
          <option value="3">3 Days</option>
          <option value="7">7 Days</option>
        </select>
        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded hover:bg-gray-600 transition duration-300"
        >
          Create Proposal
        </button>
      </form>
    </div>
  )
}

export default CreateProposal
