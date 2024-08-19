import React from "react"
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { getWeb3 } from "../util/web3.util"

import Landing from "../pages/Landing"
import Proposals from "../pages/Proposals"
import GasTracker from "../pages/GasTracker"
import DelegateVote from "../pages/DelegateVote"
import CreateProposal from "../pages/CreateProposal"

describe("checks all the pages renders correctly", () => {
  it("renders create proposal page", () => {
    render(<CreateProposal />)
    expect(screen.getByText("Name of the proposal:")).toBeInTheDocument()
    expect(screen.getByText("Description of the proposal:")).toBeInTheDocument()
    expect(screen.getByText("Select Duration:")).toBeInTheDocument()
    expect(screen.getByText("Create Proposal")).toBeInTheDocument()
  })

  it("renders delegate vote page", () => {
    render(<DelegateVote />)
    expect(
      screen.getByText(
        "You can delegate your voting power to another address. This will allow the address to vote on your behalf. Once your delegated address has voted on a proposal, you will not be able to vote on the same proposal.",
      ),
    ).toBeInTheDocument()
    expect(screen.getByText("Delegate to Address:")).toBeInTheDocument()
  })

  it("renders gas tracker page", () => {
    render(<GasTracker />)
    expect(screen.getByText("Last Refreshed At")).toBeInTheDocument()
    expect(screen.getByText("Gas price")).toBeInTheDocument()
    expect(
      screen.getByText("Gas required to create a proposal"),
    ).toBeInTheDocument()
    expect(screen.getByText("Gas required to vote")).toBeInTheDocument()
    expect(
      screen.getByText("Gas required to delegate vote"),
    ).toBeInTheDocument()
  })

  it("renders proposals page", () => {
    render(<Proposals />)
    expect(screen.getByText("Proposals")).toBeInTheDocument()
  })

  it("renders landing page", () => {
    window.ethereum = getWeb3()
    render(<Landing />)
    expect(screen.getByText("Connect wallet to continue")).toBeInTheDocument()
    expect(screen.getByText("Connect Wallet")).toBeInTheDocument()
  })
})
