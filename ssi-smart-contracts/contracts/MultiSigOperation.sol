pragma solidity ^0.5.1;

contract MultiSigOperation {

  mapping(uint256 => OperationParam) operations;
  mapping(bytes32 => OperationExecutor) executors;
  mapping(bytes32 => bytes32) opTypePermission;

  PermissionRegistry registry;
  uint256 opCount;

  constructor(address contract_address) public {
    opCount = 0;
    registry = PermissionRegistry(contract_address);
  }

  function submitOperation( params ) public{
    require(executors[opType] != 0x0);
    require(registry.actorHasPermission(address_0, opTypePermission[_opType], msg.sender), "no permission");

    // pack operation param 

    confirm(opCount);
    return opCount;
  }

  function confirmOperation(uint256 opId) public {
    require(registry.actorHasPermission(operations[opId].identity, opTypePermission[operations[opId].opType], msg.sender), "no permission");
    confirm(opId);
  }

  function confirm (uint256 opId) internal {
    // it has to be submitted before anyone can confirm it
    require(operations[opId].identity != address(0),"");
    require(confirmations[opId][msg.sender] == false, "");
    confirmations[opId][msg.sender] = true;
    operations[opId].confitamtionsCount += 1;
    executeOperation(opId);
  }

  function revokeConfirm() public {}

  function executeOperation(uint256 opId) internal {
    require(operations[opId].executed == false, "Operation already executed");
    if (registry.quorumSatisfied(operations[opId].identity, operations[opId].permission, operations[opId].confitamtionsCount)) {
      Operation storage o = operations[opId];
      o.executed = true;
      executors[o.opType].execute(o.identity, o.opType, params);    
    }
  }

  function addExecutor(bytes32 opType, bytes32 permission) public {
    require(executors[opType] == 0x0, "");
    // registry.registerPermission(permission)
    opTypePermission[opType] = permission;
    executors[opType] = OperationExecutor(msg.sender);
  }

}

contract PermissionRegistry {
  // function registerPermission(bytes32 permission) public {}
  function quorumSatisfied(address identity, uint8 confirmationCount) public view returns(bool) {}
  function actorHasPermission(address identity, bytes32 permission, address actor) public view returns(bool) {}
}

contract OperationExecutor {
  function execute(address identity, bytes32 opType, string[] memory params) public {}
}
