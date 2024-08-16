import React from "react"

function Proposal(props) {
  return (
    <div className="m-10 p-4 bg-white rounded-lg border border-gray-500 w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{props.name}</h2>
      <p className="text-gray-700 mb-4">{props.description}</p>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <button
            className="px-4 py-2 bg-black text-green-700 rounded-lg hover:bg-gray-600"
            // onClick={handleUpvote}
          >
            Upvote
          </button>
          <span className="text-black font-semibold">
            {props.noOfUpVotes} Upvotes
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="px-4 py-2 bg-black text-red-700 rounded-lg hover:bg-gray-600"
            // onClick={handleDownvote}
          >
            Downvote
          </button>
          <span className="text-black font-semibold">
            {props.noOfDownVotes} Downvotes
          </span>
        </div>
      </div>
    </div>
  )
}

export default Proposal
