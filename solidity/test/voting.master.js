const VotingMaster = artifacts.require("VotingMaster")
const time = require("@openzeppelin/test-helpers").time

const dateUtil = require("../util/date.util")
const helperUtil = require("../util/helper.util")

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000"

//----------------------------------------------- Proposal creation ---------------------------------------------------

contract("Proposals creation", async (accounts) => {
  let votingMasterInstance = null
  beforeEach(async () => {
    votingMasterInstance = await VotingMaster.deployed()
  })

  it("should not create a proposal if the endTime is in the past", async () => {
    try {
      await votingMasterInstance.createProposal(
        "Core contracts migration to polygon chain.",
        "Should we move our core contracts to polygon chain?",
        dateUtil.getNOldDaysUnixTimestamp(10),
        { from: accounts[0] },
      )
      assert.fail("The function should have thrown an error")
    } catch (error) {
      assert(error.message.includes("End time should be in future!"))
    }
  })

  it("should create a proposal if all parameters are correct", async () => {
    const endTime = dateUtil.getNSecondsFromNowUnixTimestamp(1000)
    const transactionData = await votingMasterInstance.createProposal(
      "Core contracts migration to polygon chain.",
      "Should we move our core contracts to polygon chain?",
      endTime,
      { from: accounts[0] },
    )

    const proposalId = transactionData.logs[0].args.proposalId
    const proposal = await votingMasterInstance.proposals(proposalId)

    assert.equal(
      proposal.name,
      "Core contracts migration to polygon chain.",
      "Name should be 'Core contracts migration to polygon chain.'",
    )
    assert.equal(
      proposal.description,
      "Should we move our core contracts to polygon chain?",
      "Description should be 'Should we move our core contracts to polygon chain?'",
    )
    assert.equal(proposal.noOfUpVotes, 0, "No of upvotes should be 0")
    assert.equal(proposal.noOfDownVotes, 0, "No of downvotes should be 0")
    assert.equal(proposal.endTime, endTime, `End time should be ${endTime}`)
  })
})

//----------------------------------------------- UpVoting a proposal --------------------------------------------------

contract("Proposals up voting", (accounts) => {
  let votingMasterInstance = null
  beforeEach(async () => {
    votingMasterInstance = await VotingMaster.deployed()
  })

  it("should not upvote a proposal if the proposal id is invalid", async () => {
    try {
      await votingMasterInstance.upVote(100, { from: accounts[0] })
      assert.fail("The function should have thrown an error")
    } catch (error) {
      assert(error.message.includes("Invalid proposal ID!"))
    }
  })

  it("should not upvote a proposal if the proposal voting time has ended", async () => {
    const voter = accounts[0]
    const votingDurationInSecs = 10
    const endTime =
      dateUtil.getNSecondsFromNowUnixTimestamp(votingDurationInSecs)
    const transaction = await votingMasterInstance.createProposal(
      "Core contracts migration to polygon chain.",
      "Should we move our core contracts to polygon chain?",
      endTime,
      { from: voter },
    )
    const proposalId = transaction.logs[0].args.proposalId

    //sleep for 2 extra seconds to make sure the voting time has ended
    await helperUtil.sleep((votingDurationInSecs + 2) * 1000)

    try {
      await votingMasterInstance.upVote(proposalId, { from: voter })
      assert.fail("The function should have thrown an error")
    } catch (error) {
      assert(error.message.includes("Proposal voting has ended!"))
    }
  })

  it("should not upvote a proposal if the user has already voted", async () => {
    const voter = accounts[0]
    const endTime = dateUtil.getNSecondsFromNowUnixTimestamp(1000)
    const transaction = await votingMasterInstance.createProposal(
      "Core contracts migration to polygon chain.",
      "Should we move our core contracts to polygon chain?",
      endTime,
      { from: voter },
    )
    const proposalId = transaction.logs[0].args.proposalId
    await votingMasterInstance.upVote(proposalId, { from: voter })

    try {
      await votingMasterInstance.upVote(proposalId, { from: voter })
      assert.fail("The function should have thrown an error")
    } catch (error) {
      assert(error.message.includes("You have already voted on the proposal!"))
    }
  })

  it("should not upvote a proposal if the user has <1 ETH balance", async () => {
    const voter = accounts[0]
    const endTime = dateUtil.getNSecondsFromNowUnixTimestamp(1000)
    const transaction = await votingMasterInstance.createProposal(
      "Core contracts migration to polygon chain.",
      "Should we move our core contracts to polygon chain?",
      endTime,
      { from: voter },
    )
    const proposalId = transaction.logs[0].args.proposalId

    const voterEthBalance = (await web3.eth.getBalance(voter)) / 10 ** 18
    const voterEthBalanceToTransfer = voterEthBalance - 0.01 // leaving some for gas fees
    await web3.eth.sendTransaction({
      from: voter,
      to: NULL_ADDRESS,
      value: voterEthBalanceToTransfer * 10 ** 18,
    })

    try {
      await votingMasterInstance.upVote(proposalId, { from: voter })
      assert.fail("The function should have thrown an error")
    } catch (error) {
      assert(error.message.includes("You need >=1 ETH in your wallet to vote!"))
    }
  })

  it("should upvote a proposal according to the balance of the voter", async () => {
    const voter = accounts[1]
    const endTime = dateUtil.getNSecondsFromNowUnixTimestamp(1000)
    const transaction = await votingMasterInstance.createProposal(
      "Core contracts migration to polygon chain.",
      "Should we move our core contracts to polygon chain?",
      endTime,
      { from: voter },
    )
    const proposalId = transaction.logs[0].args.proposalId

    const voterEthBalance = Math.floor(
      (await web3.eth.getBalance(voter)) / 10 ** 18,
    )
    await votingMasterInstance.upVote(proposalId, { from: voter })
    const proposal = await votingMasterInstance.proposals(proposalId)

    assert.equal(
      proposal.noOfUpVotes,
      voterEthBalance,
      `No of up-votes should be ${voterEthBalance}`,
    )
  })
})

//----------------------------------------------- DownVoting a proposal --------------------------------------------------

contract("Proposals down voting", (accounts) => {
  let votingMasterInstance = null
  beforeEach(async () => {
    votingMasterInstance = await VotingMaster.deployed()
  })

  it("should not downvote a proposal if the proposal id is invalid", async () => {
    try {
      await votingMasterInstance.downVote(100, { from: accounts[0] })
      assert.fail("The function should have thrown an error")
    } catch (error) {
      assert(error.message.includes("Invalid proposal ID!"))
    }
  })

  it("should not downvote a proposal if the proposal voting time has ended", async () => {
    const voter = accounts[0]
    const votingDurationInSecs = 10
    const endTime =
      dateUtil.getNSecondsFromNowUnixTimestamp(votingDurationInSecs)
    const transaction = await votingMasterInstance.createProposal(
      "Core contracts migration to polygon chain.",
      "Should we move our core contracts to polygon chain?",
      endTime,
      { from: voter },
    )
    const proposalId = transaction.logs[0].args.proposalId

    //sleep for 2 extra seconds to make sure the voting time has ended
    await helperUtil.sleep((votingDurationInSecs + 2) * 1000)

    try {
      await votingMasterInstance.downVote(proposalId, { from: voter })
      assert.fail("The function should have thrown an error")
    } catch (error) {
      assert(error.message.includes("Proposal voting has ended!"))
    }
  })

  it("should not downvote a proposal if the user has already voted", async () => {
    const voter = accounts[0]
    const endTime = dateUtil.getNSecondsFromNowUnixTimestamp(1000)
    const transaction = await votingMasterInstance.createProposal(
      "Core contracts migration to polygon chain.",
      "Should we move our core contracts to polygon chain?",
      endTime,
      { from: voter },
    )
    const proposalId = transaction.logs[0].args.proposalId
    await votingMasterInstance.downVote(proposalId, { from: voter })

    try {
      await votingMasterInstance.downVote(proposalId, { from: voter })
      assert.fail("The function should have thrown an error")
    } catch (error) {
      assert(error.message.includes("You have already voted on the proposal!"))
    }
  })

  it("should not downvote a proposal if the user has <1 ETH balance", async () => {
    const voter = accounts[0]
    const endTime = dateUtil.getNSecondsFromNowUnixTimestamp(1000)
    const transaction = await votingMasterInstance.createProposal(
      "Core contracts migration to polygon chain.",
      "Should we move our core contracts to polygon chain?",
      endTime,
      { from: voter },
    )
    const proposalId = transaction.logs[0].args.proposalId

    const voterEthBalance = (await web3.eth.getBalance(voter)) / 10 ** 18
    const voterEthBalanceToTransfer = voterEthBalance - 0.01 // leaving some for gas fees
    await web3.eth.sendTransaction({
      from: voter,
      to: NULL_ADDRESS,
      value: voterEthBalanceToTransfer * 10 ** 18,
    })

    try {
      await votingMasterInstance.downVote(proposalId, { from: voter })
      assert.fail("The function should have thrown an error")
    } catch (error) {
      assert(error.message.includes("You need >=1 ETH in your wallet to vote!"))
    }
  })

  it("should downvote a proposal according to the balance of the voter", async () => {
    const voter = accounts[1]
    const endTime = dateUtil.getNSecondsFromNowUnixTimestamp(1000)
    const transaction = await votingMasterInstance.createProposal(
      "Core contracts migration to polygon chain.",
      "Should we move our core contracts to polygon chain?",
      endTime,
      { from: voter },
    )
    const proposalId = transaction.logs[0].args.proposalId

    const voterEthBalance = Math.floor(
      (await web3.eth.getBalance(voter)) / 10 ** 18,
    )
    await votingMasterInstance.downVote(proposalId, { from: voter })
    const proposal = await votingMasterInstance.proposals(proposalId)

    assert.equal(
      proposal.noOfDownVotes,
      voterEthBalance,
      `No of down-votes should be ${voterEthBalance}`,
    )
  })
})

//----------------------------------------------- Voting delegation ------------------------------------------------

contract("voting delegation", async (accounts) => {
  let votingMasterInstance = null
  beforeEach(async () => {
    votingMasterInstance = await VotingMaster.deployed()
  })

  it("should not delegate vote if the address is already a delegatee for some other address", async () => {
    const delegator = accounts[0]
    const delegatee = accounts[1]
    const anotherDelegator = accounts[2]
    await votingMasterInstance.delegateVote(delegatee, { from: delegator })

    try {
      await votingMasterInstance.delegateVote(delegatee, {
        from: anotherDelegator,
      })
      assert.fail("The function should have thrown an error")
    } catch (error) {
      assert(
        error.message.includes(
          "The delegatee is already delegated by some user!",
        ),
      )
    }
  })

  it("should not delegate vote if the delegatee is the delegator", async () => {
    try {
      await votingMasterInstance.delegateVote(accounts[3], {
        from: accounts[3],
      })
      assert.fail("The function should have thrown an error")
    } catch (error) {
      assert(error.message.includes("You cannot delegate yourself!"))
    }
  })

  it("should not delegate vote if the delegatee address is invalid", async () => {
    try {
      await votingMasterInstance.delegateVote(
        "0x0000000000000000000000000000000000000000",
        {
          from: accounts[4],
        },
      )
      assert.fail("The function should have thrown an error")
    } catch (error) {
      assert(error.message.includes("Invalid delegatee address!"))
    }
  })

  it("should delegate vote if all parameters are correct", async () => {
    const delegator = accounts[5]
    const delegatee = accounts[6]
    await votingMasterInstance.delegateVote(delegatee, { from: delegator })

    const delegateeFromContract =
      await votingMasterInstance.delegatees(delegator)
    assert.equal(
      delegatee,
      delegateeFromContract,
      `Delegatee should be ${delegatee}`,
    )
  })
})

//----------------------------------------------- Up Voting By Delegation ----------------------------------------------

contract("Up voting by delegation", async (accounts) => {
  let votingMasterInstance = null
  beforeEach(async () => {
    votingMasterInstance = await VotingMaster.deployed()
  })

  it("should not upvote a proposal if the proposal id is invalid", async () => {
    try {
      await votingMasterInstance.upVoteByDelegate(100, { from: accounts[0] })
      assert.fail("The function should have thrown an error")
    } catch (error) {
      assert(error.message.includes("Invalid proposal ID!"))
    }
  })

  it("should not upvote a proposal if the user is not delegated by any user", async () => {
    const voter = accounts[0]
    const endTime = dateUtil.getNSecondsFromNowUnixTimestamp(1000)
    const transaction = await votingMasterInstance.createProposal(
      "Core contracts migration to polygon chain.",
      "Should we move our core contracts to polygon chain?",
      endTime,
      { from: voter },
    )

    const proposalId = transaction.logs[0].args.proposalId
    try {
      await votingMasterInstance.upVoteByDelegate(proposalId, { from: voter })
      assert.fail("The function should have thrown an error")
    } catch (error) {
      assert(error.message.includes("You are not delegated by any user!"))
    }
  })

  it("should not upvote a proposal if the proposal voting time has ended", async () => {
    const delegator = accounts[0]
    const delegatee = accounts[1]
    await votingMasterInstance.delegateVote(delegatee, { from: delegator })

    const votingDurationInSecs = 10
    const endTime =
      dateUtil.getNSecondsFromNowUnixTimestamp(votingDurationInSecs)
    const transaction = await votingMasterInstance.createProposal(
      "Core contracts migration to polygon chain.",
      "Should we move our core contracts to polygon chain?",
      endTime,
      { from: delegator },
    )
    const proposalId = transaction.logs[0].args.proposalId

    // sleep for 2 extra seconds to make sure the voting time has ended
    await helperUtil.sleep((votingDurationInSecs + 2) * 1000)

    try {
      await votingMasterInstance.upVoteByDelegate(proposalId, {
        from: delegatee,
      })
      assert.fail("The function should have thrown an error")
    } catch (error) {
      assert(error.message.includes("Proposal voting has ended!"))
    }
  })

  it("should not upvote a proposal if the delegator has already voted", async () => {
    const delegator = accounts[3]
    const delegatee = accounts[4]

    const endTime = dateUtil.getNSecondsFromNowUnixTimestamp(1000)
    const transaction = await votingMasterInstance.createProposal(
      "Core contracts migration to polygon chain.",
      "Should we move our core contracts to polygon chain?",
      endTime,
      { from: delegator },
    )
    const proposalId = transaction.logs[0].args.proposalId

    await votingMasterInstance.upVote(proposalId, { from: delegator })
    await votingMasterInstance.delegateVote(delegatee, { from: delegator })
    try {
      await votingMasterInstance.upVoteByDelegate(proposalId, {
        from: delegatee,
      })
      assert.fail("The function should have thrown an error")
    } catch (error) {
      assert(
        error.message.includes(
          "The delegator has already voted on the proposal!",
        ),
      )
    }
  })

  it("should not upvote a proposal if the user has <1 ETH balance", async () => {
    const delegator = accounts[5]
    const delegatee = accounts[6]
    await votingMasterInstance.delegateVote(delegatee, { from: delegator })

    const endTime = dateUtil.getNSecondsFromNowUnixTimestamp(1000)
    const transaction = await votingMasterInstance.createProposal(
      "Core contracts migration to polygon chain.",
      "Should we move our core contracts to polygon chain?",
      endTime,
      { from: delegatee },
    )
    const proposalId = transaction.logs[0].args.proposalId

    const delegateeEthBalance =
      (await web3.eth.getBalance(delegatee)) / 10 ** 18
    const delegateeEthBalanceToTransfer = delegateeEthBalance - 0.01 // leaving some for gas fees
    await web3.eth.sendTransaction({
      from: delegatee,
      to: NULL_ADDRESS,
      value: delegateeEthBalanceToTransfer * 10 ** 18,
    })

    try {
      await votingMasterInstance.upVoteByDelegate(proposalId, {
        from: delegatee,
      })
      assert.fail("The function should have thrown an error")
    } catch (error) {
      assert(error.message.includes("You need >=1 ETH in your wallet to vote!"))
    }
  })

  it("should upvote a proposal according to the balance of the voter", async () => {
    const delegator = accounts[7]
    const delegatee = accounts[8]
    await votingMasterInstance.delegateVote(delegatee, { from: delegator })

    const endTime = dateUtil.getNSecondsFromNowUnixTimestamp(1000)
    const transaction = await votingMasterInstance.createProposal(
      "Core contracts migration to polygon chain.",
      "Should we move our core contracts to polygon chain?",
      endTime,
      { from: delegatee },
    )
    const proposalId = transaction.logs[0].args.proposalId

    const delegateeEthBalance = Math.floor(
      (await web3.eth.getBalance(delegatee)) / 10 ** 18,
    )
    await votingMasterInstance.upVoteByDelegate(proposalId, { from: delegatee })
    const proposal = await votingMasterInstance.proposals(proposalId)

    assert.equal(
      proposal.noOfUpVotes,
      delegateeEthBalance,
      `No of up-votes should be ${delegateeEthBalance}`,
    )
  })
})

//----------------------------------------------- Down Voting By Delegation ----------------------------------------------

contract("Down voting by delegation", async (accounts) => {
  let votingMasterInstance = null
  beforeEach(async () => {
    votingMasterInstance = await VotingMaster.deployed()
  })

  it("should not downvote a proposal if the proposal id is invalid", async () => {
    try {
      await votingMasterInstance.downVoteByDelegate(100, { from: accounts[0] })
      assert.fail("The function should have thrown an error")
    } catch (error) {
      assert(error.message.includes("Invalid proposal ID!"))
    }
  })

  it("should not downvote a proposal if the user is not delegated by any user", async () => {
    const voter = accounts[0]
    const endTime = dateUtil.getNSecondsFromNowUnixTimestamp(1000)
    const transaction = await votingMasterInstance.createProposal(
      "Core contracts migration to polygon chain.",
      "Should we move our core contracts to polygon chain?",
      endTime,
      { from: voter },
    )

    const proposalId = transaction.logs[0].args.proposalId
    try {
      await votingMasterInstance.downVoteByDelegate(proposalId, { from: voter })
      assert.fail("The function should have thrown an error")
    } catch (error) {
      assert(error.message.includes("You are not delegated by any user!"))
    }
  })

  it("should not downvote a proposal if the proposal voting time has ended", async () => {
    const delegator = accounts[0]
    const delegatee = accounts[1]
    await votingMasterInstance.delegateVote(delegatee, { from: delegator })

    const votingDurationInSecs = 10
    const endTime =
      dateUtil.getNSecondsFromNowUnixTimestamp(votingDurationInSecs)
    const transaction = await votingMasterInstance.createProposal(
      "Core contracts migration to polygon chain.",
      "Should we move our core contracts to polygon chain?",
      endTime,
      { from: delegator },
    )
    const proposalId = transaction.logs[0].args.proposalId

    // sleep for 2 extra seconds to make sure the voting time has ended
    await helperUtil.sleep((votingDurationInSecs + 2) * 1000)

    try {
      await votingMasterInstance.downVoteByDelegate(proposalId, {
        from: delegatee,
      })
      assert.fail("The function should have thrown an error")
    } catch (error) {
      assert(error.message.includes("Proposal voting has ended!"))
    }
  })

  it("should not downvote a proposal if the delegator has already voted", async () => {
    const delegator = accounts[3]
    const delegatee = accounts[4]

    const endTime = dateUtil.getNSecondsFromNowUnixTimestamp(1000)
    const transaction = await votingMasterInstance.createProposal(
      "Core contracts migration to polygon chain.",
      "Should we move our core contracts to polygon chain?",
      endTime,
      { from: delegator },
    )
    const proposalId = transaction.logs[0].args.proposalId

    await votingMasterInstance.downVote(proposalId, { from: delegator })
    await votingMasterInstance.delegateVote(delegatee, { from: delegator })
    try {
      await votingMasterInstance.downVoteByDelegate(proposalId, {
        from: delegatee,
      })
      assert.fail("The function should have thrown an error")
    } catch (error) {
      assert(
        error.message.includes(
          "The delegator has already voted on the proposal!",
        ),
      )
    }
  })

  it("should not downvote a proposal if the user has <1 ETH balance", async () => {
    const delegator = accounts[5]
    const delegatee = accounts[6]
    await votingMasterInstance.delegateVote(delegatee, { from: delegator })

    const endTime = dateUtil.getNSecondsFromNowUnixTimestamp(1000)
    const transaction = await votingMasterInstance.createProposal(
      "Core contracts migration to polygon chain.",
      "Should we move our core contracts to polygon chain?",
      endTime,
      { from: delegatee },
    )
    const proposalId = transaction.logs[0].args.proposalId

    const delegateeEthBalance =
      (await web3.eth.getBalance(delegatee)) / 10 ** 18
    const delegateeEthBalanceToTransfer = delegateeEthBalance - 0.01 // leaving some for gas fees
    await web3.eth.sendTransaction({
      from: delegatee,
      to: NULL_ADDRESS,
      value: delegateeEthBalanceToTransfer * 10 ** 18,
    })

    try {
      await votingMasterInstance.downVoteByDelegate(proposalId, {
        from: delegatee,
      })
      assert.fail("The function should have thrown an error")
    } catch (error) {
      assert(error.message.includes("You need >=1 ETH in your wallet to vote!"))
    }
  })

  it("should downvote a proposal according to the balance of the voter", async () => {
    const delegator = accounts[7]
    const delegatee = accounts[8]
    await votingMasterInstance.delegateVote(delegatee, { from: delegator })

    const endTime = dateUtil.getNSecondsFromNowUnixTimestamp(1000)
    const transaction = await votingMasterInstance.createProposal(
      "Core contracts migration to polygon chain.",
      "Should we move our core contracts to polygon chain?",
      endTime,
      { from: delegatee },
    )
    const proposalId = transaction.logs[0].args.proposalId

    const delegateeEthBalance = Math.floor(
      (await web3.eth.getBalance(delegatee)) / 10 ** 18,
    )
    await votingMasterInstance.downVoteByDelegate(proposalId, {
      from: delegatee,
    })
    const proposal = await votingMasterInstance.proposals(proposalId)

    assert.equal(
      proposal.noOfDownVotes,
      delegateeEthBalance,
      `No of down-votes should be ${delegateeEthBalance}`,
    )
  })
})

//-------------------------------------------- Viewing results --------------------------------------------------------

contract("View the results of proposals", async (accounts) => {
  let votingMasterInstance = null
  beforeEach(async () => {
    votingMasterInstance = await VotingMaster.deployed()
  })

  it("should not give the results of the proposal where the given proposal id is invalid", async () => {
    try {
      await votingMasterInstance.viewResults(100)
      assert.fail("The function should have thrown an error")
    } catch (error) {
      assert(error.message.includes("Invalid proposal ID!"))
    }
  })

  it("should not give the results of the proposal which has not ended yet", async () => {
    const voter = accounts[0]
    const endTime = dateUtil.getNSecondsFromNowUnixTimestamp(1000)
    const transaction = await votingMasterInstance.createProposal(
      "Core contracts migration to polygon chain.",
      "Should we move our core contracts to polygon chain?",
      endTime,
      { from: voter },
    )
    const proposalId = transaction.logs[0].args.proposalId

    try {
      await votingMasterInstance.viewResults(proposalId)
      assert.fail("The function should have thrown an error")
    } catch (error) {
      assert(error.message.includes("Proposal voting is ongoing!"))
    }
  })

  it("should give 'PASSED' result of a proposal which has ended and has more upVotes than downVotes", async () => {
    const voter = accounts[0]
    const votingDurationInSeconds = 10
    const endTime = dateUtil.getNSecondsFromNowUnixTimestamp(
      votingDurationInSeconds,
    )
    const transaction = await votingMasterInstance.createProposal(
      "Core contracts migration to polygon chain.",
      "Should we move our core contracts to polygon chain?",
      endTime,
      { from: voter },
    )
    const proposalId = transaction.logs[0].args.proposalId
    await votingMasterInstance.upVote(proposalId, { from: voter })

    // Increase time by 12 seconds to go beyond the proposal's end time (this is done to increase the time on the local blockchain)
    await time.increase(votingDurationInSeconds + 2)
    await helperUtil.sleep((votingDurationInSeconds + 2) * 1000)

    const isPassed = await votingMasterInstance.viewResults.call(proposalId)
    assert(isPassed, "The proposal should have been passed!")
  })

  it("should give 'NOT PASSED' result of a proposal which has ended and has more downVotes than upVotes", async () => {
    const voter = accounts[0]
    const votingDurationInSeconds = 20
    const endTime = dateUtil.getNSecondsFromNowUnixTimestamp(
      votingDurationInSeconds,
    )
    const transaction = await votingMasterInstance.createProposal(
      "Core contracts migration to polygon chain.",
      "Should we move our core contracts to polygon chain?",
      endTime,
      { from: voter },
    )

    const proposalId = transaction.logs[0].args.proposalId
    await votingMasterInstance.downVote(proposalId, { from: voter })

    // Increase time by 22 seconds to go beyond the proposal's end time (this is done to increase the time on the local blockchain)
    await time.increase(votingDurationInSeconds + 2)
    await helperUtil.sleep((votingDurationInSeconds + 2) * 1000)

    const isPassed = await votingMasterInstance.viewResults.call(proposalId)
    assert.equal(isPassed, false, "The proposal should not have been passed!")
  })
})
