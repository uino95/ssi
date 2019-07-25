pragma solidity ^0.5.1;

import './OperationExecutor.sol';
import './PermissionRegistry.sol';

/// @title MultiSigOperations - Generalized multi signature operations contract for a Self Sovereign Identity approach
/// @notice An identity can have multiple delegates with different permissions for each OperationExecutor contract. This can either be the addition and remotion of delegates, or the update of a credential status on a status list. It needs a contract extending PermissionRegistry interface to hold the permissions which will be used to handle confirmations and executions of operations.
/// @author Andrea Taglia - drew.taglia@gmail.com
contract MultiSigOperations{

  /**
  Events
  */
  event Submission(address indexed identity, address sender, uint operationId, address indexed executor, uint lastOperationBlock);
  event Confirmation(address indexed identity, address sender, uint operationId, address indexed executor, uint lastOperationBlock);
  event Revocation(address indexed identity, address sender, uint operationId, address indexed executor, uint lastOperationBlock);
  event Execution(address indexed identity, uint operationId, address indexed executor, uint lastOperationBlock);

  /**
  Storage
  */
  mapping(uint => Operation) public operations;
  mapping(uint => mapping(address => bool)) public confirmations;
  mapping(address => uint) public lastOperationBlock;
  address public deployer;
  PermissionRegistry public permissionRegistry;
  uint256 public operationsCount;
  bool public stopped = false;
  /// @dev generic operation structure
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

  /**
  Modifiers
  */
  /// @dev asks the permission registry contract whether permission for the message sender are satisfied for the given identity and the given executor address
  modifier needsPermission(address identity, address executorAddress){
    require(executorAddress != address(0x0), "unknown executor address");
    require(permissionRegistry.actorHasPermission(identity, executorAddress, msg.sender), "permission has not been granted");
    _;
  }
  modifier stopInEmergency {require(!stopped, "circuit breaker active"); _;}
  modifier onlyInEmergency {require(stopped, "circuit breaker not active"); _;}
  modifier onlyDeployer {require(msg.sender == deployer, "only contract deployer can execute"); _;}

  /**
  Constructor
  */
  /// @notice sets the deployer of the contract equals to message sender
  constructor() public {
    deployer = msg.sender;
  }

  /**
  Public Functions
  */
  /// @dev need to set PermissionRegistry contract address before the contract can start operating
  /// @param registryAddress (address) any contract address extending PermissionRegistry interface
  function setPermissionRegistry(address registryAddress) public {
    require(msg.sender == deployer, "only deployer");
    require(address(permissionRegistry) == address(0x0), "registry already set");
    permissionRegistry = PermissionRegistry(registryAddress);
  }

  /// @notice in case of emergency it can be called by the deployer to block the contract confirming any operation
  function enableCircuitBreaker() public onlyDeployer() stopInEmergency(){
    stopped = true;
  }

  /// @notice used to go back functioning after an emergency stop
  function disableCircuitBreaker() public onlyDeployer() onlyInEmergency(){
    stopped = false;
  }


  /// @dev operation's parameters are packed into generic arrays. Execute methods of each executor contract expects its own params
  /// @notice entry point to submit a generic operation
  /// @param identity (address) identity subject of the operation
  /// @param executor (address) contract address extending OperationExecutor interface on which the operation will be executed
  /// @param intParams () generic integer parameters for the operation
  /// @param stringParams (string) generic string parameter for the operation
  /// @param addressParams () generic address parameters for the operation
  /// @param bytesParams () generic bytes parameters for the operation
  /// @return  (uint256) operation ID
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

  /// @notice entry point to confirm an operation. Only authorized addresses for that executor and for that identity are authorized
  /// @param opId (uint256) operation identifier to be confirm
  function confirmOperation(uint256 opId) public needsPermission(operations[opId].identity, operations[opId].executor) {
    confirm(opId);
  }

  /**
  Internal Functions
  */

  /// @param opId (uint256) operation identifier to be confirmed
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


  /// @notice allows to revoke a confirmation already placed for a certain operation, as long as that operation has not been executed yet
  /// @param opId (uint256) operation identifier for which to revoke confirmation
  function revokeConfirmation(uint256 opId) public {
    Operation storage op = operations[opId];
    require(op.identity != address(0), "operation does not exist");
    require(op.executed == false, "operation already executed");
    require(confirmations[opId][msg.sender] == true, "sender has not confirmed this operation yet");
    confirmations[opId][msg.sender] = false;
    op.confirmationsCount -= 1;
    emit Revocation(op.identity, msg.sender, opId, op.executor, lastOperationBlock[op.identity]);
    lastOperationBlock[op.identity] = block.number;
    executeOperation(opId);
  }


  /// @dev generic operation executor. it checks the operation has enough confirmation, then calls the execute method on the intended OperationExecutor contract
  /// @param opId (uint256) operation identitifier to execute
  /// @return  (bool) whether the operation has been executed or not
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



