pragma solidity ^0.5.0;

contract StatusRegistry {

  mapping (address => Delegate) delegates;
  mapping (address => mapping (uint256 => State)) public credentialList;
  mapping (uint256 => Operation) operations;
  uint256 opCount;
  uint requiredCount;

  struct State{
      States credentialStatus;
      bytes32 statusReason;
      uint256 time;
  }

  struct Delegate{
      mapping (address => uint256) delegateList;
      uint256 delegateCount;
  }

  struct Operation{
      address issuer;
      uint256 credentialId;
      States credentialStatus;
      bytes32 statusReason;
      address delegate;
      mapping(address => bool) confirmations;
      uint256 validity;
      uint256 count;
  }

  enum States {VALID, REVOKED, SUSPENDED}

  modifier onlyAuthorized(address issuer) {
    require (msg.sender == issuer || delegates[issuer].delegateList[msg.sender] > now || delegates[issuer].delegateList[msg.sender] == 1);
    _;
  }

  constructor(uint _requiredCount) public {
      opCount = 1;
      requiredCount = _requiredCount;
  }

  //event CredentialStatusChanged(address indexed issuer, uint indexed credentialId, byte credentialStatus, byte statusReason, uint indexed timestamp);

  /// set the status
  function setCredentialStatus(address _issuer, uint256 _credentialId, States _credentialStatus, bytes32 _statusReason, uint256 _opId) onlyAuthorized(_issuer) public returns(uint256 opID){
    //emit CredentialStatusChanged(issuer, credentialId, credentialStatus, statusReason, now);
    opID = updateOperation(_opId, _issuer, _credentialId, _credentialStatus, _statusReason, address(0), 0);
    if(hasToExecute(opID)){
        address iss = operations[opID].issuer;
        uint256 credId = operations[opID].credentialId;
        credentialList[iss][credId].credentialStatus = operations[opID].credentialStatus;
        credentialList[iss][credId].statusReason = operations[opID].statusReason;
        credentialList[iss][credId].time = now;
        operations[opID].count = 0;
    }
  }

  function addDelegate(address _issuer, address delegate, uint256 validity, uint256 _opId) onlyAuthorized(_issuer) public returns(uint256 opID){
    opID = updateOperation(_opId, _issuer, 0, States.VALID, 0x00, delegate, validity);
    if(hasToExecute(opID)){
        address iss = operations[opID].issuer;
        address del = operations[opID].delegate;
        if(operations[opID].validity == 0){
            delegates[iss].delegateList[del] = 1 ;    //permanent delegate without expiration
        } else {
            delegates[iss].delegateList[del] = now + operations[opID].credentialId;
        }
        delegates[iss].delegateCount ++;
        operations[opID].count = 0;
    }
  }

  function revokeDelegate(address _issuer, address delegate, uint256 _opId) onlyAuthorized(_issuer) public returns(uint256 opID){
    opID = updateOperation(_opId, _issuer, 0, States.VALID, 0x00, delegate, 0);
    if(hasToExecute(opID)){
        delegates[operations[opID].issuer].delegateList[operations[opID].delegate] = 0;
        delegates[operations[opID].issuer].delegateCount --;
        operations[opID].count = 0;
    }
  }

  function updateOperation(uint256 _opId, address _issuer, uint256 _credentialId, States _credentialStatus, bytes32 _statusReason, address _delegate, uint256 validity) internal returns(uint256 opID){
    if(_opId == 0){
        opID = opCount;
        operations[opCount].issuer = _issuer;
        operations[opCount].credentialId = _credentialId;
        operations[opCount].credentialStatus = _credentialStatus;
        operations[opCount].statusReason = _statusReason;
        operations[opCount].delegate = _delegate;
        operations[opCount].validity = validity;
        operations[opCount].confirmations[msg.sender] = true;
        operations[opCount].count = 1;
        opCount ++;
    } else {
        opID = _opId;
        require(!operations[_opId].confirmations[msg.sender]);
        operations[_opId].count += 1;
        operations[_opId].confirmations[msg.sender] = true;
    }
  }

  function hasToExecute(uint256 _opId) internal view returns(bool){
    return delegates[operations[_opId].issuer].delegateCount < 1 || operations[_opId].count >= requiredCount;
  }
}
