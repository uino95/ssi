const StatusRegistry = artifacts.require("StatusRegistry");

module.exports = function(deployer) {
  deployer.deploy(StatusRegistry, 2);
};