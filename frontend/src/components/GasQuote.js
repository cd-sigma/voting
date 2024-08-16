import React from "react"

function GasQuote(props) {
  return (
    <div className="p-4 m-[10px] bg-gray-100 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {props.action}
      </h2>
      <p className="text-gray-700 text-lg">
        <span className="font-bold text-green-600">{props.gasConsumed}</span>
      </p>
    </div>
  )
}

export default GasQuote
