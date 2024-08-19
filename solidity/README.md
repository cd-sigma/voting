# Voting Smart Contract

## Overview

The `VotingMaster` smart contract is a decentralized voting system on the Ethereum blockchain. It allows users to create
proposals and vote on them using their Ethereum wallet balance as the weight of their votes.

You can find the code for this contract in the `contracts/VotingMaster.sol` file.

## Features

- **Proposal Creation:** Anyone can create a proposal by providing a name, description, and end time (a unix timestamp)
- **Voting:** Users can upvote or downvote proposals, with voting power proportional to their wallet balance (1 ETH = 1
  vote).
- **Delegation:** Users can delegate their voting rights to another user, allowing the delegatee to vote on their
  behalf.
- **Vote Results:** The contract allows users to view the outcome of a proposal once voting has ended.

## Running Tests

To ensure the smart contract functions correctly, you can run the provided tests using Truffle. Make sure you
have [Truffle](https://www.trufflesuite.com/) installed.

### Steps to Run Tests

1. **Compile the Contracts:**
   Before running the tests, ensure the smart contracts are compiled.

   ```bash
   truffle compile
   ```
2. **Run the Tests:**
   Use the following command to run the tests:

   ```bash
   truffle test
   ```

### Deployment

The VotingMaster contract is deployed on the sepolia and holesky testnets. The contract is deployed at the following
addresses:

1. Sepolia Testnet:
   [0x08d433754ec29337b8b8eb10b59dd3e503473225](https://sepolia.etherscan.io/address/0x08d433754ec29337b8b8eb10b59dd3e503473225)
2. Holesky Testnet:
   [0x278ed1E396297562d83Fe620609a93411f56ec6d](https://holesky.etherscan.io/address/0x278ed1E396297562d83Fe620609a93411f56ec6d)

You can deploy the contract using Truffle by following these steps:

1. **Update the `truffle-config.js` File:**
   Update the `truffle-config.js` file with your network configuration.
2. **Deploy the Contract:**
   Run the following command to deploy the contract:

   ```bash
   truffle migrate --network <network-name>
   ```
   Replace `<network-name>` with the name of the network you want to deploy the contract to.

The truffle-config file already has the configuration for the holesky testnet.

## Contract Details

### Structs

- **Proposal:**
    - `name`: Name of the proposal.
    - `description`: Description of the proposal.
    - `noOfUpVotes`: The number of upvotes received.
    - `noOfDownVotes`: The number of downvotes received.
    - `endTime`: The unix timestamp when the voting ends.

### State Variables

- `proposals`: Mapping from proposal ID to `Proposal` struct.
- `proposalsCount`: The total number of proposals created.
- `hasVoted`: Mapping to track whether an address has voted on a specific proposal.
- `delegatees`: Mapping to track the delegatees of the respective delegators.
- `delegators`: Mapping to track the delegators of the respective delegatees.

## Functions

### 1. `createProposal(string memory _name, string memory _description, uint256 _endTime)`

- **Description:** Creates a new proposal with the given name, description, and end time.
- **Returns:** The proposal ID of the newly created proposal.
- **Validations:**
    - `_endTime` must be in the future.

### 2. `upVote(uint256 _proposalId)`

- **Description:** Upvotes a proposal.
- **Returns:** A boolean indicating whether the vote was successful.
- **Validations:**
    - Proposal must exist.
    - Voting must still be open.
    - The sender must not have already voted on the proposal.
    - The sender must have at least 1 ETH in their wallet.

### 3. `downVote(uint256 _proposalId)`

- **Description:** Downvotes a proposal.
- **Returns:** A boolean indicating whether the vote was successful.
- **Validations:**
    - Proposal must exist.
    - Voting must still be open.
    - The sender must not have already voted on the proposal.
    - The sender must have at least 1 ETH in their wallet.

### 4. `delegateVote(address _delegatee)`

- **Description:** Delegates the caller's voting rights to another address.
- **Returns:** A boolean indicating whether the delegation was successful.
- **Validations:**
    - The delegatee must not already be delegated by another user.
    - The delegatee must not be the caller.
    - The delegatee must be a valid address.

### 5. `upVoteByDelegate(uint256 _proposalId)`

- **Description:** Upvotes a proposal on behalf of a delegator. Once the delegatee has voted on a proposal, the
  delegator
  cannot vote on the same proposal.
- **Returns:** A boolean indicating whether the vote was successful.
- **Validations:**
    - Proposal must exist.
    - Voting must still be open.
    - The caller must be delegated by a user.
    - The delegator must not have already voted on the proposal.
    - The delegatee must have at least 1 ETH in their wallet.

### 6. `downVoteByDelegate(uint256 _proposalId)`

- **Description:** Downvotes a proposal on behalf of a delegator. Once the delegatee has voted on a proposal, the
  delegator
  cannot vote on the same proposal.
- **Returns:** A boolean indicating whether the vote was successful.
- **Validations:**
    - Proposal must exist.
    - Voting must still be open.
    - The caller must be delegated by a user.
    - The delegator must not have already voted on the proposal.
    - The delegatee must have at least 1 ETH in their wallet.

### 7. `viewResults(uint256 _proposalId)`

- **Description:** Views the results of a proposal after the voting period has ended.
- **Returns:** A boolean indicating whether the proposal passed (more upvotes than downvotes).
- **Validations:**
    - Proposal must exist.
    - The voting period must have ended.
