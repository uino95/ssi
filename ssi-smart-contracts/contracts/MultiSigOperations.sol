pragma solidity ^0.5.1;

import './OperationExecutor.sol';
import './PermissionRegistry.sol';

contract MultiSigOperations{

  /*
     *  Events
     */
    event Submission(address sender, uint indexed operationId, uint lastOperationBlock);
    event Confirmation(address sender, uint indexed operationId, uint lastOperationBlock);
    event Revocation(address sender, uint indexed operationId, uint lastOperationBlock);
    event Execution(uint indexed operationId, uint lastOperationBlock);

  mapping(uint => Operation) public operations;
  mapping(uint => mapping(address => bool)) public confirmations;
  mapping(address => uint) public lastOperationBlock;

  address public deployer;
  PermissionRegistry public permissionRegistry;
  uint256 public operationsCount;

  modifier needsPermission(address identity, address executorAddress){
    require(executorAddress != address(0x0), "unknown executor address");
    require(permissionRegistry.actorHasPermission(identity, executorAddress, msg.sender), "permission has not been granted");
    _;
  }

  struct Operation {
    address identity;
    bool executed;
    uint8 confirmationsCount;
    uint256[] intParams;
    string stringParams;
    //addressParams[0] = executor address
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
  function submitOperation(address identity, uint256[] memory intParams, string memory stringParams, address[] memory addressParams, bytes32[] memory bytesParams) public needsPermission(identity, addressParams[0]) returns (uint256) {
    operationsCount += 1;
    operations[operationsCount] = Operation({
      executed: false,
      identity: identity,
      confirmationsCount: 0,
      intParams: intParams,
      stringParams: stringParams,
      addressParams: addressParams,
      bytesParams: bytesParams
    });
    emit Submission(msg.sender, operationsCount, lastOperationBlock[identity]);
    lastOperationBlock[identity] = block.number;
    confirm(operationsCount);
    return operationsCount;
  }

  function confirmOperation(uint256 opId) public needsPermission(operations[opId].identity, operations[opId].addressParams[0]) {
    confirm(opId);
  }

  function confirm(uint256 opId) internal {
    require(operations[opId].identity != address(0),"operation does not exist");
    require(confirmations[opId][msg.sender] == false, "sender already confirmed this operation");
    confirmations[opId][msg.sender] = true;
    operations[opId].confirmationsCount += 1;
    emit Confirmation(msg.sender, opId, lastOperationBlock[operations[opId].identity]);
    lastOperationBlock[operations[opId].identity] = block.number;
    executeOperation(opId);
  }

  // function revokeConfirm() public {}

  function executeOperation(uint256 opId) internal returns (bool) {
    Operation storage op = operations[opId];
    require(op.executed == false, "Operation already executed");
    if (permissionRegistry.quorumSatisfied(op.identity, op.confirmationsCount)) {
      op.executed = true;
      OperationExecutor executor = OperationExecutor(op.addressParams[0]);
      executor.execute(op.identity, op.intParams, op.stringParams, op.addressParams, op.bytesParams);
      emit Execution(opId, lastOperationBlock[operations[opId].identity]);
      lastOperationBlock[operations[opId].identity] = block.number;
      return true;
    }
    return false;
  }

}

