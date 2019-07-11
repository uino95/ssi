pragma solidity ^0.5.1;

contract CredentialStatusRegistry {

  bytes32 constant public REVOKE_PERMISSION = "statusRegMgmt";

  PermissionRegistry registry;

  mapping(address => mapping (uint256 => State)) public credentialList;

  struct State{
      uint8 credentialStatus;
      bytes32 statusReason;
      uint256 time;
  }

  struct SetCredentialStatusOperation {
    address issuer;
    uint256 credentialId;
    uint8 credentialStatus;
    bytes32 statusReason;
    bool executed;
    uint8 confitamtionsCount;
  }

  constructor(address contract_address) public {
    registry = PistisDIDRegistry(contract_address);
  }

  function submitSetCredentialStatus(address _issuer, uint256 _credentialId, uint8 _credentialStatus, bytes32 _statusReason)
    public
    returns (uint256)
  {
    uint256 opId = operation.submit(
        
        _issuer,
        _credentialId,
        _credentialStatus,
        _statusReason
    );

    return opId;
  }

  function confirmSetCredentialStatus(uint256 opId)
    public
  {
    require(registry.validDelegate(operations[opId].issuer, REVOKE_PERMISSION, msg.sender));
    // it has to be submitted before anyone can confirm it
    require(operations[opId].issuer != address(0));
    require(confirmations[opId][msg.sender] == false);
    confirmations[opId][msg.sender] = true;
    operations[opId].confitamtionsCount += 1;
    executeOperation(opId);
  }

  function revokeConfirmation(uint256 opId)
    public
  {
    require(registry.validDelegate(operations[opId].issuer, REVOKE_PERMISSION, msg.sender));
    require(confirmations[opId][msg.sender] == true);
    require(operations[opId].executed == false);
    confirmations[opId][msg.sender] == false;
    operations[opId].confitamtionsCount -= 1;
  }

  function executeOperation(uint256 opId) internal {
    require(operations[opId].executed == false);
    if (registry.quorumSatisfied(operations[opId].issuer, REVOKE_PERMISSION, operations[opId].confitamtionsCount)) {
        SetCredentialStatusOperation storage o = operations[opId];
        o.executed = true;
        State storage state = credentialList[operations[opId].issuer][operations[opId].credentialId];
        state.credentialStatus = operations[opId].credentialStatus;
        state.statusReason = operations[opId].statusReason;
        state.time = now;
        operations[opId].confitamtionsCount = 0;
        emit Execution(opId);
    }
  }

}

contract PistisDIDRegistry {
  function quorumSatisfied(address, bytes32, uint8) public view returns(bool) {}
  function validDelegate(address, bytes32, address) public view returns(bool) {}
}
