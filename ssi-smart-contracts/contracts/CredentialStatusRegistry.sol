pragma solidity ^0.5.1;

import './OperationExecutor.sol';

/// @title CredentialStatusRegistry
/// @notice Operation Executor implementation to handle credential status per issuer, exploiting the multi signature approach of the multiSigOperations contract address
/// @author Andrea Taglia - <drew.taglia@gmail.com>
contract CredentialStatusRegistry is OperationExecutor{

  /// @notice maps issuers of credentials to credential id and its state
  mapping(address => mapping (uint256 => State)) public credentialList;
  /// @notice credential state made by a status code, status reason and time of issuing
  struct State{
      uint256 credentialStatus;
      bytes32 statusReason;
      uint256 time;
  }

  /// @param multiSigContract (address) address of the multiSigOperations contract to handle multi sig updates on this contract structure
  constructor (address multiSigContract) OperationExecutor(multiSigContract) public {}


  /// @dev change the status of a credential
  /// @param identity (address) identity relative to changes to make
  /// @param intParams (uint256[]) index 0 has to carry the id of the credential to be changed. index 1 has to carry the credential Status code. other indexes not used
  /// @param stringParams (string) not used
  /// @param addressParams (address[]) not used
  /// @param bytesParams (bytes32[]) index 0 has to carry the status reason. other indexes not used
  /// @return  (bool) true if everything went well
  function execute(address identity, uint256[] memory intParams, string memory stringParams, address[] memory addressParams, bytes32[] memory bytesParams) public returns (bool){
    super.execute(identity, intParams, stringParams, addressParams, bytesParams);
    credentialList[identity][intParams[0]] = State({
      credentialStatus: intParams[1],
      statusReason: bytesParams[0],
      time: now
    });
    return true;
  }

}

