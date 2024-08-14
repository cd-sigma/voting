const VotingMaster = artifacts.require("VotingMaster");

module.exports = function(deployer) {
    deployer.deploy(VotingMaster);
};