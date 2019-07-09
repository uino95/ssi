// const StatusRegistry = artifacts.require("StatusRegistry");
const PistisDIDRegistry = artifacts.require("PistisDIDRegistry");

module.exports = function(deployer) {
  // deployer.deploy(StatusRegistry, 2);
  deployer.deploy(PistisDIDRegistry);
};
