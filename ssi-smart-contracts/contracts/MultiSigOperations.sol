pragma solidity ^0.5.1;

import './OperationExecutor.sol';
import './PermissionRegistry.sol';

contract MultiSigOperations{

  //keep track of operations
  mapping(uint256 => Operation) operations;
  mapping(uint => mapping(address => bool)) public confirmations;
  //map executors to their permission
  // mapping(address => bool) activeExecutors;

  address deployer;
  PermissionRegistry public permissionRegistry;
  uint256 public operationsCount;

  modifier actorHasPermission(address identity, address executorAddress){
    require(executorAddress != address(0x0), "unknown executor address");
    require(permissionRegistry.actorHasPermission(identity, executorAddress, msg.sender), "permission has not been granted");
    _;
  }

  struct Operation{
    address identity;
    bool executed;
    uint8 confirmationsCount;
    OperationParams params;
  }

  //addressParams[0] = executor address
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
  function setPermissionRegistry(address registryAddress) public {
    require(msg.sender == deployer, "only deployer");
    require(address(permissionRegistry) == address(0x0), "registry already set");
    permissionRegistry = PermissionRegistry(registryAddress);
  }

  //addressParams[0] = executor address
  function submitOperation(address identity, uint256[] memory intParams, string memory stringParams, address[] memory addressParams, bytes32[] memory bytesParams) public actorHasPermission(identity, addressParams[0]) returns (uint) {
    operationsCount += 1;
    // operations[operationsCount] = Operation({
    //   executed: false,
    //   identity: identity,
    //   confirmationsCount: 0,
    //   params: OperationParams({
    //     intParams: intParams,
    //     stringParams: stringParams,
    //     addressParams: addressParams,
    //     bytesParams: bytesParams
    //   })
    // });
    // confirm(operationsCount);
    return operationsCount;
  }

  function confirmOperation(uint256 opId) public actorHasPermission(operations[opId].identity, operations[opId].params.addressParams[0]) {
    confirm(opId);
  }

  function confirm (uint256 opId) internal {
    require(operations[opId].identity != address(0),"operation does not exist");
    require(confirmations[opId][msg.sender] == false, "sender already confirmed this operation");
    confirmations[opId][msg.sender] = true;
    operations[opId].confirmationsCount += 1;
    // executeOperation(opId);
  }

  // function revokeConfirm() public {}

  function executeOperation(uint256 opId) internal returns (bool) {
    Operation storage op = operations[opId];
    require(op.executed == false, "Operation already executed");
    if (permissionRegistry.quorumSatisfied(op.identity, op.confirmationsCount)) {
      op.executed = true;
      OperationExecutor executor = OperationExecutor(op.params.addressParams[0]);
      // return executor.execute(op.identity, op.params.intParams, op.params.stringParams, op.params.addressParams, op.params.bytesParams);
    }
    return false;
  }

}

