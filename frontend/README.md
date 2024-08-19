# Frontend Project

## Overview

This is a decentralized voting application on the Ethereum blockchain. Users can create proposals, upvote or downvote
them, delegate voting power, and view the results of proposals after the voting period ends.

## Project Link

https://voting-olive.vercel.app/

## Getting Started

Follow the instructions below to get the project running on your local machine.

### Prerequisites

Ensure you have the following installed:

- Node.js
- npm (Node Package Manager)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/cd-sigma/voting
   cd voting/frontend
   ```

2. Install dependencies:
   ```bash
    npm install
    ```

### Running the Application

1. Start the development server:
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000/`.


2. To build the application for production:
   ```bash
   npm run build
   ```
   The build files will be available in the `build` directory.


3. To run the tests:
   ```bash
   npm test
   ```
   This will run the tests in watch mode.

### Video Walkthrough

https://www.loom.com/share/7

### Using the DApp

1. You will need to have MetaMask installed in your browser. If you don't have it installed, you can download it from
   [here](https://metamask.io/).
2. Connect MetaMask to the holesky test network. The reason i have choosed holesky testnet is because it is relatively
   easier to get testnet ETH on holesky testnet. You will need >=1ETH in your wallet to be able to vote.

#### Creating a Proposal

1. Click on the `Create Proposal` button.
2. Enter the name, description, and the number of days the proposal will be open for voting.
3. Click on the `Create Proposal` button.
4. Confirm the transaction in MetaMask.
5. The proposal will be created.

#### Voting on a Proposal

1. Click on the `View Proposals` button.
2. Click on any active proposal.
3. Click on the `Up Vote` or `Down Vote` button.
4. Confirm the transaction in MetaMask.
5. Your vote will be recorded.

#### Delegating Voting Power

1. Click on the `Delegate Voting Power` button.
2. Enter the address of the user you want to delegate your voting power to.
3. Click on the `Delegate` button.
4. Confirm the transaction in MetaMask.
5. Your voting power will be delegated.

#### Voting on a proposal with delegated voting power

1. Click on the `View Proposals` button.
2. Click on any active proposal.
3. If you are delegated by any user, you will see two more buttons in addition to the `UpVote` and `DownVote` buttons.
4. Click on the `Up Vote By Delegate` or `Down Vote By Delegate` button.
5. Confirm the transaction in MetaMask.
6. Your vote will be recorded.

   