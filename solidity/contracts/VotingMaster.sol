// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract VotingMaster {
    using SafeMath for uint256;

    struct Proposal {
        string name;
        string description;
        uint256 noOfUpVotes;
        uint256 noOfDownVotes;
        uint256 endTime;
    }

    mapping(address => mapping(uint256 => bool)) public hasVoted;
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalsCount;

    mapping(address => address) public delegatees;
    mapping(address => address) public delegators;

    event VoteDelegated(address delegator, address delegatee);
    event UpVoted(uint256 indexed proposalId, address voter, uint256 voteWeight);
    event DownVoted(uint256 indexed proposalId, address voter, uint256 voteWeight);
    event ProposalCreated(uint256 indexed proposalId, string name, string description, uint256 endTime);
    event UpVotedByDelegate(uint256 indexed proposalId, address delegator, address delegatee, uint256 voteWeight);
    event DownVotedByDelegate(uint256 indexed proposalId, address delegator, address delegatee, uint256 voteWeight);

    /**
    * @dev Creates a new proposal
    *
    * Emits an {ProposalCreated} event indicating the proposal ID, name, description and end time.
    *
    * Requirements:
    * - `_endTime` should be in future
    *
     */
    function createProposal(string memory _name, string memory _description, uint256 _endTime) public returns (uint256 _proposalId){
        require(_endTime > block.timestamp, "End time should be in future!");

        _proposalId = proposalsCount;

        proposals[proposalsCount].name = _name;
        proposals[proposalsCount].description = _description;
        proposals[proposalsCount].endTime = _endTime;
        proposals[proposalsCount].noOfUpVotes = 0; //default to 0 upVotes
        proposals[proposalsCount].noOfDownVotes = 0; //default to 0 downVotes

        proposalsCount++;

        emit ProposalCreated(_proposalId, _name, _description, _endTime);
    }

    /**
    * @dev Upvotes a proposal
    *
    * Emits an {UpVoted} event indicating the proposal ID, voter and vote weight.
    *
    * Requirements:
    * - `_proposalId` should be valid
    * - Proposal voting should not have ended
    * - Voter should not have already voted on the proposal
    * - Voter should have >=1 ETH in their wallet
    *
        */
    function upVote(uint256 _proposalId) public returns (bool _isSuccess){
        require(_proposalId <= proposalsCount, "Invalid proposal ID!");

        Proposal storage proposal = proposals[_proposalId];
        require(proposal.endTime > block.timestamp, "Proposal voting has ended!");

        require(!hasVoted[msg.sender][_proposalId], "You have already voted on the proposal!");

        uint256 voteWeight = msg.sender.balance.div(1 ether);
        require(voteWeight > 0, "You need >=1 ETH in your wallet to vote!");

        proposal.noOfUpVotes = proposal.noOfUpVotes.add(voteWeight);
        hasVoted[msg.sender][_proposalId] = true;

        emit UpVoted(_proposalId, msg.sender, voteWeight);
        return true;
    }

    /**
    * @dev Downvotes a proposal
    *
    * Emits an {DownVoted} event indicating the proposal ID, voter and vote weight.
    *
    * Requirements:
    * - `_proposalId` should be valid
    * - Proposal voting should not have ended
    * - Voter should not have already voted on the proposal
    * - Voter should have >=1 ETH in their wallet
    *
    */
    function downVote(uint256 _proposalId) public returns (bool _isSuccess){
        require(_proposalId <= proposalsCount, "Invalid proposal ID!");

        Proposal storage proposal = proposals[_proposalId];
        require(proposal.endTime > block.timestamp, "Proposal voting has ended!");

        require(!hasVoted[msg.sender][_proposalId], "You have already voted on the proposal!");

        uint256 voteWeight = msg.sender.balance.div(1 ether);
        require(voteWeight > 0, "You need >=1 ETH in your wallet to vote!");

        proposal.noOfDownVotes = proposal.noOfDownVotes.add(voteWeight);
        hasVoted[msg.sender][_proposalId] = true;

        emit DownVoted(_proposalId, msg.sender, voteWeight);
        return true;
    }

    /**
    * @dev Upvotes a proposal by a delegate
    *
    * Emits an {UpVotedByDelegate} event indicating the proposal ID, delegator, delegatee and vote weight.
    *
    * NOTE: The delegator should have delegated msg.sender before calling this function. Also,
    * the delegator should not have already voted on the proposal, neither should the msg.sender.
    *
    * Requirements:
    * - `_proposalId` should be valid
    * - Proposal voting should not have ended
    * - Delegator should not have already voted on the proposal
    * - Delegatee(msg.sender) should not have voted on the proposal
    * - Delegatee(msg.sender) be delegated by some user
    * - Delegatee(msg.sender) should have >=1 ETH in their wallet
    *
    */
    function upVoteByDelegate(uint256 _proposalId) public returns (bool _isSuccess) {
        require(_proposalId <= proposalsCount, "Invalid proposal ID!");
        require(delegators[msg.sender] != address(0), "You are not delegated by any user!");

        Proposal storage proposal = proposals[_proposalId];
        require(proposal.endTime > block.timestamp, "Proposal voting has ended!");

        address delegator = delegators[msg.sender];
        require(!hasVoted[msg.sender][_proposalId], "You have already voted on the proposal!");
        require(!hasVoted[delegator][_proposalId], "The delegator has already voted on the proposal!");

        uint256 voteWeight = msg.sender.balance.div(1 ether);
        require(voteWeight > 0, "You need >=1 ETH in your wallet to vote!");

        proposal.noOfUpVotes = proposal.noOfUpVotes.add(voteWeight);
        hasVoted[delegator][_proposalId] = true;
        hasVoted[msg.sender][_proposalId] = true;

        emit UpVotedByDelegate(_proposalId, delegator, msg.sender, voteWeight);
        return true;
    }

    /**
   * @dev Downvotes a proposal by a delegate
    *
    * Emits an {DownVotedByDelegate} event indicating the proposal ID, delegator, delegatee and vote weight.
    *
    * NOTE: The delegator should have delegated msg.sender before calling this function. Also,
    * the delegator should not have already voted on the proposal, neither should the msg.sender.
    *
    * Requirements:
    * - `_proposalId` should be valid
    * - Proposal voting should not have ended
    * - Delegator should not have already voted on the proposal
    * - Delegatee(msg.sender) should not have voted on the proposal
    * - Delegatee(msg.sender) be delegated by some user
    * - Delegatee(msg.sender) should have >=1 ETH in their wallet
    *
    */
    function downVoteByDelegate(uint256 _proposalId) public returns (bool _isSuccess) {
        require(_proposalId <= proposalsCount, "Invalid proposal ID!");
        require(delegators[msg.sender] != address(0), "You are not delegated by any user!");

        Proposal storage proposal = proposals[_proposalId];
        require(proposal.endTime > block.timestamp, "Proposal voting has ended!");

        address delegator = delegators[msg.sender];
        require(!hasVoted[msg.sender][_proposalId], "You have already voted on the proposal!");
        require(!hasVoted[delegator][_proposalId], "The delegator has already voted on the proposal!");

        uint256 voteWeight = msg.sender.balance.div(1 ether);
        require(voteWeight > 0 ether, "You need >=1 ETH in your wallet to vote!");

        proposal.noOfDownVotes = proposal.noOfDownVotes.add(voteWeight);
        hasVoted[delegator][_proposalId] = true;
        hasVoted[msg.sender][_proposalId] = true;

        emit DownVotedByDelegate(_proposalId, delegator, msg.sender, voteWeight);
        return true;
    }

    /**
    * @dev Delegates voting power to another user
    *
    * Emits an {VoteDelegated} event indicating the delegator and delegatee.
    *
    * Requirements:
    * - `_delegatee` should not have been delegated by any other user
    * - `_delegatee` should not be the delegator
    * - `_delegatee` should be a valid address
    *
    */
    function delegateVote(address _delegatee) public returns (bool _isSuccess){
        require(delegators[_delegatee] == address(0), "The delegatee is already delegated by some user!");
        require(msg.sender != _delegatee, "You cannot delegate yourself!");
        require(_delegatee != address(0), "Invalid delegatee address!");

        delegatees[msg.sender] = _delegatee;
        delegators[_delegatee] = msg.sender;

        emit VoteDelegated(msg.sender, _delegatee);
        return true;
    }

    /**
    *
    * @dev Views the results of a proposal
    *
    * Requirements:
    * - `_proposalId` should be valid
    * - Proposal voting should have ended
    *
    */
    function viewResults(uint256 _proposalId) public payable returns (bool _isPassed){
        require(_proposalId <= proposalsCount, "Invalid proposal ID!");

        Proposal storage proposal = proposals[_proposalId];
        require(proposal.endTime < block.timestamp, "Proposal voting is ongoing!");

        return (proposal.noOfUpVotes >= proposal.noOfDownVotes);
    }
}