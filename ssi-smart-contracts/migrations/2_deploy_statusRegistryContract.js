const MultiSigOperations = artifacts.require("MultiSigOperations");
const PistisDIDRegistry = artifacts.require("PistisDIDRegistry");
const CredentialStatusRegistry = artifacts.require("CredentialStatusRegistry");

module.exports = function (deployer) {

  var multiSigOperationInstance;
  deployer.then(function () {
    return deployer.deploy(MultiSigOperations);
  }).then(function (instance) {
    multiSigOperationInstance = instance;
    console.log('MultiSig: ' + instance.address);
    return deployer.deploy(PistisDIDRegistry, 2, multiSigOperationInstance.address);
  }).then(function (instance) {
    console.log('PistisDIDRegistry: ' + instance.address);
    multiSigOperationInstance.setPermissionRegistry(instance.address);
    return deployer.deploy(CredentialStatusRegistry, multiSigOperationInstance.address);
  }).then(function (instance) {
    console.log('CredentialStatusRegistry: ' + instance.address);
  });

};