pragma solidity ^0.5.1;

import './OperationExecutor.sol';

contract CredentialStatusRegistry is OperationExecutor{

  mapping(address => mapping (uint256 => State)) public credentialList;

  struct State{
      uint256 credentialStatus;
      bytes32 statusReason;
      uint256 time;
  }

  constructor(address contract_address) public {
    multiSigContract = contract_address;
  }

  //intParams[1] = credentialId
  //intParams[2] = credentialStatus
  //bytesParams[0] = statusReason
  function execute(address identity, uint256[] memory intParams, string memory stringParams, address[] memory addressParams, bytes32[] bytesParams) public onlyMultiSigContract(msg.sender) returns (bool){
    credentialList[identity][intParams[1]] = State({
      credentialStatus: intParams[2],
      statusReason: bytesParams[0],
      time: now
    });
    return true;
  }

}
