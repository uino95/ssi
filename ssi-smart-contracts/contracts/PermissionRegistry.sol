pragma solidity ^0.5.1;

import './OperationExecutor.sol';

contract PermissionRegistry is OperationExecutor {

  constructor (address multiSigContract) OperationExecutor(multiSigContract) public {}

  function actorHasPermission(address identity, address executor, address actor) public view returns(bool);
  function quorumSatisfied(address identity, uint8 confirmationCount) public view returns(bool);
}