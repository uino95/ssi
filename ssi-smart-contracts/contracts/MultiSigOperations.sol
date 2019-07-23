pragma solidity ^0.5.1;

import './OperationExecutor.sol';
import './PermissionRegistry.sol';

/// @title MultiSigOperations
/// @author Andrea Taglia
contract MultiSigOperations{

    /*
     *  Events
     */
    event Submission(address indexed identity, address sender, uint operationId, address indexed executor, uint lastOperationBlock);
    event Confirmation(address indexed identity, address sender, uint operationId, address indexed executor, uint lastOperationBlock);
    event Revocation(address indexed identity, address sender, uint operationId, address indexed executor, uint lastOperationBlock);
    event Execution(address indexed identity, uint operationId, address indexed executor, uint lastOperationBlock);


  mapping(uint => Operation) public operations;
  mapping(uint => mapping(address => bool)) public confirmations;
  mapping(address => uint) public lastOperationBlock;
  address public deployer;
  PermissionRegistry public permissionRegistry;
  uint256 public operationsCount;
  bool public stopped = false;

  modifier needsPermission(address identity, address executorAddress){
    require(executorAddress != address(0x0), "unknown executor address");
    require(permissionRegistry.actorHasPermission(identity, executorAddress, msg.sender), "permission has not been granted");
    _;
  }

  modifier stopInEmergency {require(!stopped, "circuit breaker active"); _;}
  modifier onlyInEmergency {require(stopped, "circuit breaker not active"); _;}
  modifier onlyDeployer {require(msg.sender == deployer, "only contract deployer can execute"); _;}

  struct Operation {
    address identity;
    bool executed;
    uint8 confirmationsCount;
    address executor;
    uint256[] intParams;
    string stringParams;
    address[] addressParams;
    bytes32[] bytesParams;
  }

  constructor() public {
    deployer = msg.sender;
  }

  //PermissionRegistry set up

  /// @param registryAddress (address)
  function setPermissionRegistry(address registryAddress) public {
    require(msg.sender == deployer, "only deployer");
    require(address(permissionRegistry) == address(0x0), "registry already set");
    permissionRegistry = PermissionRegistry(registryAddress);
  }

  function enableCircuitBreaker() public onlyDeployer() stopInEmergency(){
    stopped = true;
  }

  function disableCircuitBreaker() public onlyDeployer() onlyInEmergency(){
    stopped = false;
  }


  /// @param identity (address)
  /// @param executor (address)
  /// @param intParams ()
  /// @param stringParams (string)
  /// @param addressParams ()
  /// @param bytesParams ()
  /// @return  (uint256)
  function submitOperation(address identity, address executor, uint256[] memory intParams, string memory stringParams, address[] memory addressParams, bytes32[] memory bytesParams) public needsPermission(identity, executor) returns (uint256) {
    operationsCount += 1;
    operations[operationsCount] = Operation({
      executed: false,
      identity: identity,
      confirmationsCount: 0,
      executor: executor,
      intParams: intParams,
      stringParams: stringParams,
      addressParams: addressParams,
      bytesParams: bytesParams
    });
    emit Submission(identity, msg.sender, operationsCount, executor, lastOperationBlock[identity]);
    lastOperationBlock[identity] = block.number;
    confirm(operationsCount);
    return operationsCount;
  }


  /// @param opId (uint256)
  function confirmOperation(uint256 opId) public needsPermission(operations[opId].identity, operations[opId].executor) {
    confirm(opId);
  }

  function confirm(uint256 opId) internal stopInEmergency(){
    Operation storage op = operations[opId];
    require(op.identity != address(0), "operation does not exist");
    require(confirmations[opId][msg.sender] == false, "sender already confirmed this operation");
    confirmations[opId][msg.sender] = true;
    op.confirmationsCount += 1;
    emit Confirmation(op.identity, msg.sender, opId, op.executor, lastOperationBlock[op.identity]);
    lastOperationBlock[op.identity] = block.number;
    executeOperation(opId);
  }


  /// @param opId (uint256)
  function revokeConfirmation(uint256 opId) public {
    Operation storage op = operations[opId];
    require(op.identity != address(0), "operation does not exist");
    require(confirmations[opId][msg.sender] == true, "sender has not confirmed this operation yet");
    confirmations[opId][msg.sender] = false;
    op.confirmationsCount -= 1;
    emit Revocation(op.identity, msg.sender, opId, op.executor, lastOperationBlock[op.identity]);
    lastOperationBlock[op.identity] = block.number;
    executeOperation(opId);
  }


  /// @param opId (uint256)
  /// @return  (bool)
  function executeOperation(uint256 opId) internal returns (bool) {
    Operation storage op = operations[opId];
    require(op.executed == false, "Operation already executed");
    if (permissionRegistry.quorumSatisfied(op.identity, op.executor, op.confirmationsCount)) {
      op.executed = true;
      OperationExecutor executor = OperationExecutor(op.executor);
      emit Execution(op.identity, opId, op.executor, lastOperationBlock[op.identity]);
      lastOperationBlock[op.identity] = block.number;
      executor.execute(op.identity, op.intParams, op.stringParams, op.addressParams, op.bytesParams);
      return true;
    }
    return false;
  }

}


