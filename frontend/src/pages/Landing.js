import React from "react"

function Landing(props) {
  return (
    <div>
      <div className="text-center">
        <h1 className="text-4xl font-bold mt-40 mb-20">
          Welcome to the voting portal.
        </h1>
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
    </div>
  )
}

export default Landing
