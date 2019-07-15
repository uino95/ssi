pragma solidity ^0.5.1;

import './OperationExecutor.sol';
import './PermissionRegistry.sol';

contract MultiSigOperations{

  //keep track of operations
  mapping(uint256 => Operation) operations;
  mapping(uint => mapping(address => bool)) public confirmations;
  //map executors to their permission
  mapping(address => bool) activeExecutors;

  address deployer;
  PermissionRegistry permissionRegistry;
  uint256 operationsCount;

  modifier actorHasPermission(identity, executor, actor){
    require(executor != address(0x0), "unknown executor address");
    require(registry.actorHasPermission(identity, executorAddress, msg.sender), "permission has not been granted");
    _;
  }

  struct Operation{
    address identity;
    bool executed;
    uint8 confirmationsCount;
    address executor;
    OperationParams params;
  }

  struct OperationParams {
    uint256[] intParams;
    string stringParams;
    address[] addressParams;
    bytes32[] bytesParams;
  }

  constructor() public {
    deployer = msg.sender;
  }

  //PermissionRegistry set up
  function setMultiSigOperations(address _registryAddress) public {
    require(msg.sender == depoyer, "only deployer");
    require(address(permissionRegistry) != address(0x0), "registry already set");
    registryAddress = _registryAddress;
  }

  //addressParams[0] = executor address
  function submitOperation(address identity, uint256[] memory intParams, string memory stringParams, address[] memory addressParams, bytes32[] memory bytesParams) public actorHasPermission(identity, addressParams[0], msg.sender) returns (uint) {
    //intParams[0] always has operationType as first param
    address executorAddress = addressParams[0];
    operations[operationsCount] = Operation({
      executed: false,
      identity: identity,
      confirmationsCount: 0,
      executor: executorAddress,
      params: OperationParams({
        //beware operationType is still in the intParams[0]
        intParams: intParams,
        stringParams: stringParams,
        addressParams: addressParams,
        bytesParams: bytesParams
      })
    });
    operationsCount += 1;
    confirm(operationsCount);
    return operationsCount;
  }

  function confirmOperation(uint256 opId) public actorHasPermission(identity, addressParams[0], msg.sender) {
    confirm(opId);
  }

  function confirm (uint256 opId) internal {
    require(operations[opId].identity != address(0),"operation does not exist");
    require(confirmations[opId][msg.sender] == false, "sender already confirmed this operation");
    confirmations[opId][msg.sender] = true;
    operations[opId].confirmationsCount += 1;
    executeOperation(opId);
  }

  // function revokeConfirm() public {}

  function executeOperation(uint256 opId) internal returns (bool) {
    Operation storage op = operations[opId];
    require(op.executed == false, "Operation already executed");
    if (permissionRegistry.quorumSatisfied(op.identity, op.confirmationsCount)) {
      op.executed = true;
      OperationExecutor executor = OperationExecutor(op.executor);
      return executor.execute(op.identity, op.params.intParams, op.params.stringParams, op.params.addressParams, op.params.bytesParams);
    }
  }

}

