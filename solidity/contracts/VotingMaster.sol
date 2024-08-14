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

    event ProposalCreated(uint256 indexed proposalId, string name, string description, uint256 endTime);

    function createProposal(string memory _name, string memory _description, uint256 _endTime) public returns (uint256 _proposalId){
        require(_endTime > block.timestamp, "End time should be in future!");

        _proposalId = proposalsCount;

        proposals[proposalsCount].name = _name;
        proposals[proposalsCount].description = _description;
        proposals[proposalsCount].endTime = _endTime;
        proposals[proposalsCount].noOfUpVotes = 0; //default to 0 upVotes
        proposals[proposalsCount].noOfDownVotes = 0; //default to 0 downVotes

        emit ProposalCreated(_proposalId, _name, _description, _endTime);

        proposalsCount++;
    }

    function upVote(uint256 _proposalId) public returns (bool _isSuccess){
        require(_proposalId <= proposalsCount, "Invalid proposal ID!");

        Proposal storage proposal = proposals[_proposalId];
        require(proposal.endTime > block.timestamp, "Proposal voting has ended!");

        require(!hasVoted[msg.sender][_proposalId], "You have already voted on the proposal!");

        uint256 voteWeight = msg.sender.balance.div(1 ether);
        require(voteWeight > 0, "You need >=1 ETH in your wallet to vote!");

        proposal.noOfUpVotes = proposal.noOfUpVotes.add(voteWeight);
        hasVoted[msg.sender][_proposalId] = true;

        return true;
    }

    function downVote(uint256 _proposalId) public returns (bool _isSuccess){
        require(_proposalId <= proposalsCount, "Invalid proposal ID!");

        Proposal storage proposal = proposals[_proposalId];
        require(proposal.endTime > block.timestamp, "Proposal voting has ended!");

        require(!hasVoted[msg.sender][_proposalId], "You have already voted on the proposal!");

        uint256 voteWeight = msg.sender.balance.div(1 ether);
        require(voteWeight > 0, "You need >=1 ETH in your wallet to vote!");

        proposal.noOfDownVotes = proposal.noOfDownVotes.add(voteWeight);
        hasVoted[msg.sender][_proposalId] = true;

        return true;
    }

    function upVoteByDelegate(uint256 _proposalId) public returns (bool _isSuccess) {
        require(_proposalId <= proposalsCount, "Invalid proposal ID!");
        require(delegators[msg.sender] != address(0), "You are not delegated by any user!");

        Proposal storage proposal = proposals[_proposalId];
        require(proposal.endTime > block.timestamp, "Proposal voting has ended!");

        address delegator = delegators[msg.sender];
        require(!hasVoted[delegator][_proposalId], "The delegator has already voted on the proposal!");

        uint256 voteWeight = msg.sender.balance.div(1 ether);
        require(voteWeight > 0, "You need >=1 ETH in your wallet to vote!");

        proposal.noOfUpVotes = proposal.noOfUpVotes.add(voteWeight);
        hasVoted[delegator][_proposalId] = true;

        return true;
    }

    function downVoteByDelegate(uint256 _proposalId) public returns (bool _isSuccess) {
        require(_proposalId <= proposalsCount, "Invalid proposal ID!");
        require(delegators[msg.sender] != address(0), "You are not delegated by any user!");

        Proposal storage proposal = proposals[_proposalId];
        require(proposal.endTime > block.timestamp, "Proposal voting has ended!");

        address delegator = delegators[msg.sender];
        require(!hasVoted[delegator][_proposalId], "The delegator has already voted on the proposal!");

        uint256 voteWeight = msg.sender.balance.div(1 ether);
        require(voteWeight > 0 ether, "You need >=1 ETH in your wallet to vote!");

        proposal.noOfDownVotes = proposal.noOfDownVotes.add(voteWeight);
        hasVoted[delegator][_proposalId] = true;

        return true;
    }

    function delegateVote(address _delegatee) public returns (bool _isSuccess){
        require(delegators[_delegatee] == address(0), "The delegatee is already delegated by some user!");
        require(msg.sender != _delegatee, "You cannot delegate yourself!");
        require(_delegatee != address(0), "Invalid delegatee address!");

        delegatees[msg.sender] = _delegatee;
        delegators[_delegatee] = msg.sender;
        return true;
    }

    function viewResults(uint256 _proposalId) public payable returns (bool _isPassed){
        require(_proposalId <= proposalsCount, "Invalid proposal ID!");

        Proposal storage proposal = proposals[_proposalId];
        require(proposal.endTime < block.timestamp, "Proposal voting is ongoing!");

        return (proposal.noOfUpVotes >= proposal.noOfDownVotes);
    }
}