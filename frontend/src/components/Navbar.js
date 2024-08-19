import React from "react"

function Navbar(props) {
  return (
    <div className="bg-white opacity-40 p-10 m-[30px] flex justify-between">
      <a href="/">
        <h1 className="text-4xl font-bold text-black">Voting</h1>
      </a>
    </div>
  )
}

export default Navbar
