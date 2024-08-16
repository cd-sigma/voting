import React, { useState } from "react"

function Navbar(props) {
  const [isWalletConnected, setIsWalletConnected] = useState(false)

  return (
    <div className="bg-white opacity-40 p-10 m-[30px] flex justify-between">
      <a href="/">
        <h1 className="text-4xl font-bold text-black">Voting</h1>
      </a>
      <div className="flex items-center space-x-4">
        <button className="bg-black hover:bg-gray-500 text-white font-bold py-2 px-4">
          {isWalletConnected ? `Connected 🟢` : "Connect Wallet"}
        </button>
      </div>
    </div>
  )
}

export default Navbar
