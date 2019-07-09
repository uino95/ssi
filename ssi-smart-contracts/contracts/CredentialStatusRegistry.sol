pragma solidity ^0.5.1;

contract CredentialStatusRegistry {

  event Submission(uint indexed opId);
  event Confirmation(address indexed sender, uint indexed opId);
  event Execution(uint indexed opId);

  uint256 opCount;
  uint256 constant REQUIRED_QUORUM = 2;
  bytes32 constant public REVOKE_PERMISSION = "revoke";

  PistisDIDRegistry registry;

  mapping(uint256 => SetCredentialStatusOperation) operations;
  mapping(address => mapping (uint256 => State)) public credentialList;
  mapping(uint256 => mapping (address => bool)) confirmations;

  enum States {VALID, REVOKED, SUSPENDED}

  struct State{
      States credentialStatus;
      bytes32 statusReason;
      uint256 time;
  }

  struct SetCredentialStatusOperation {
      address issuer;
      uint256 credentialId;
      States credentialStatus;
      bytes32 statusReason;
      bool executed;
      uint8 confitamtionsCount;
  }

  constructor(address contract_address) public {
      opCount = 0;
      registry = PistisDIDRegistry(contract_address);
  }

  function submitSetCredentialStatus(address _issuer, uint256 _credentialId, States _credentialStatus, bytes32 _statusReason)
    public
    returns (uint256)
  {
    require(registry.validDelegate(_issuer, REVOKE_PERMISSION, msg.sender));
    opCount += 1;
    operations[opCount] = SetCredentialStatusOperation({
        issuer: _issuer,
        credentialId: _credentialId,
        credentialStatus: _credentialStatus,
        statusReason: _statusReason,
        executed: false,
        confitamtionsCount: 0
    });
    emit Submission(opCount);
    confirmSetCredentialStatus(opCount);
    return opCount;
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
