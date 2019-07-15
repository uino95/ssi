pragma solidity ^0.5.1;

contract MultiSigOperations {

  //keep track of operations
  mapping(uint256 => Operation) operations;
  mapping(uint => mapping(address => bool)) public confirmations;
  //map operationType to executors
  mapping(uint256 => OperationExecutor) executors;
  //tells permission needed to submit/confirm a certain operation type
  mapping(uint256 => bytes32) opTypePermission;

  PermissionRegistry registry;
  uint256 operationsCount;

  struct Operation{
    address identity;
    bool executed;
    uint8 confirmationsCount;
    uint opType;
    OperationParams params;
  }

  struct OperationParams {
    uint256[] intParams;
    string stringParams;
    address[] addressParams;
  }

  constructor(address contract_address) public {
    operationsCount = 0;
    registry = PermissionRegistry(contract_address);
  }

  function submitOperation(address identity, uint256[] memory intParams, string memory stringParams, address[] memory addressParams) public returns (uint) {
    //intParams[0] always has operationType as first param
    uint256 operationType = intParams[0];
    require(executors[operationType] != address(0x0), "unknown operationType");
    require(registry.actorHasPermission(identity, opTypePermission[operationType], msg.sender), "permission has not been granted");
    operations[operationsCount] = Operation({
      executed: false,
      identity: identity,
      confirmationsCount: 0,
      opType: operationType,
      params: OperationParams({
        //beware operationType is still in the intParams[0]
        intParams: intParams,
        stringParams: stringParams,
        addressParams: addressParams
      })
    });
    operationsCount += 1;
    confirm(operationsCount);
    return operationsCount;
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
    operations[opId].confirmationsCount += 1;
    executeOperation(opId);
  }

  function revokeConfirm() public {}

  function executeOperation(uint256 opId) internal {
    Operation storage op = operations[opId];
    require(op.executed == false, "Operation already executed");
    if (registry.quorumSatisfied(op.identity, op.confirmationsCount)) {
      op.executed = true;
      executors[op.opType].execute(op.identity, op.params.intParams, op.params.stringParams, op.params.addressParams);
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
