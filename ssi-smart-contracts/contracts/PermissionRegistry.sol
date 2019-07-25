pragma solidity ^0.5.1;

import './OperationExecutor.sol';

/// @title PermissionRegistry abstract contract
/// @notice Permission Registry to handle associacion between identities, delegates and permissions alongside basic information such as quorum needed to perform a certain operation on a certain executor. It is itself an OperationExecutor as it needs to modify its structure in a multi sig manner
/// @author Andrea Taglia - <drew.taglia@gmail.com>
contract PermissionRegistry is OperationExecutor {

  /// @param multiSigContract (address) address of the multiSigOperations contract to handle multi sig updates on this contract structure
  constructor (address multiSigContract) OperationExecutor(multiSigContract) public {}

  /// @param identity (address) identity to check permissions for
  /// @param executor (address) executor to check permissions for
  /// @param actor (address) acot to check permissions for
  /// @return  (bool) whether the actor has permission relative to that identity for that executor
  function actorHasPermission(address identity, address executor, address actor) public view returns(bool);

  /// @param identity (address) identity to check quorum for
  /// @param executor (address) executor address to check quorum for
  /// @param confirmationCount (uint8) how many confirmations
  /// @return  (bool) whether the quorum is reached
  function quorumSatisfied(address identity, address executor, uint8 confirmationCount) public view returns(bool);
}
