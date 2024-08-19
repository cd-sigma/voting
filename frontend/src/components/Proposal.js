import React, { useEffect, useState } from "react"

import { getTimeRemaining } from "../util/date.util"
import { hasUserVoted } from "../util/voting.util"

function Proposal(props) {
  const [hasVoted, setHasVoted] = useState(false)

  useEffect(() => {
    const checkAccount = async () => {
      const hasVoted = await hasUserVoted(props.account, props.id)
      setHasVoted(hasVoted)
    }

    checkAccount()
  }, [props.account, props.id])

  return (
    <a href={`/proposal/${props.id}`} className="m-5">
      <div className="p-4 bg-white rounded-lg border border-gray-500 w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{props.name}</h2>
        <p className="text-gray-700 mb-4">{props.description}</p>
        <div className="flex justify-between items-center mb-4">
          {hasVoted ? (
            <span className="text-green-600">
              Already Voted <span className="text-green-500">✔</span>
            </span>
          ) : (
            <span className="text-blue-500">
              Time Remaining: {getTimeRemaining(props.endTime)}
            </span>
          )}
        </div>
      </div>
    </a>
  )
}

export default Proposal
