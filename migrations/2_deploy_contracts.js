// Contract abstraction (specific for Truffle)
// Gives election artifact so that we can interact with it
var Voting = artifacts.require("./Voting.sol");

// Deploy a contract
module.exports = function(deployer) {
  deployer.deploy(Voting);
};
