pragma solidity ^0.5.1;

import './OperationExecutor.sol';

contract PermissionRegistry is OperationExecutor {

  // function registerPermission(bytes32 permission) public {}
  function quorumSatisfied(address identity, uint8 confirmationCount) public view returns(bool);
  function actorHasPermission(address identity, bytes32 permission, address actor) public view returns(bool);
}