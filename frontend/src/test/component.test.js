import React from "react"
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"

import Navbar from "../components/Navbar"
import GasQuote from "../components/GasQuote"
import Proposal from "../components/Proposal"

describe("Checks all the reusable components render correctly", () => {
  it("renders Navbar", () => {
    render(<Navbar />)
    expect(screen.getByText("Voting")).toBeInTheDocument()
  })

  it("renders gas quote component", () => {
    render(
      <GasQuote action="Gas need to upvote a proposal" gasConsumed={100} />,
    )
    expect(
      screen.getByText("Gas need to upvote a proposal"),
    ).toBeInTheDocument()
    expect(screen.getByText("100")).toBeInTheDocument()
  })

  it("renders proposal component", () => {
    render(
      <Proposal
        id={0}
        account={"0x7863f44C6844c4a844D5dF7fdF22622a674aDfDC"}
        name={"testing"}
        description={"This is a test proposal"}
        endTime={new Date().getTime() + 1000000}
        noOfUpVotes={100}
        noOfDownVotes={50}
      />,
    )

    expect(screen.getByText("testing")).toBeInTheDocument()
    expect(screen.getByText("This is a test proposal")).toBeInTheDocument()
  })
})
