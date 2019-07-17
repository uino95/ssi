pragma solidity ^0.5.1;

import './OperationExecutor.sol';

contract CredentialStatusRegistry is OperationExecutor{

  mapping(address => mapping (uint256 => State)) public credentialList;

  struct State{
      uint256 credentialStatus;
      bytes32 statusReason;
      uint256 time;
  }

  constructor (address multiSigOperationsAddress) OperationExecutor(multiSigOperationsAddress) public {}

  //intParams[0] = credentialId
  //intParams[1] = credentialStatus
  //bytesParams[0] = statusReason
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
