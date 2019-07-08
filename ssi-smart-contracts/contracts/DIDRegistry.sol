pragma solidity ^0.5.0;

contract PistisDIDRegistry {

    //Storage
    mapping(address => mapping(bytes32 => Delegates)) public delegates;
    mapping(address => bool) public primaryAddressChanged;
    mapping(address => Service[]) public services;
    mapping(address => uint) public nonce;
    mapping(uint => mapping (address => bool)) public confirmations;
    mapping(uint => AddDelegateOperation) public operations;
    uint public operationsCount;

    // Constans
    uint constant public MAX_DELEGATES_COUNT = 20;
    uint constant public MAX_SERVICES_COUNT = 20;
    bytes32 public constant AUTH_PERMISSION = "auth";
    uint8 constant DEFAULT_REQUIRED_QUORUM = 2;

    //Modifiers
    modifier onlyAuthorized(address identity, address actor) {
        require(validDelegate(identity, AUTH_PERMISSION, actor));
        _;
    }

    //Structs
    struct Delegates {
        address[] addresses;
        uint8 delegateCount;
        uint8 requiredQuorum;
    }
    struct Service {
        string endpoint;
        bytes32 serviceType;
    }
    struct AddDelegateOperation {
        bool executed;
        address identity;
        bytes32 delegateType;
        address delegate;
        uint8 confirmationsCount;
    }

    //Events
    event DIDDelegateChanged (
        address indexed identity,
        bytes32 delegateType,
        address delegate,
        uint validTo,
        uint previousChange
    );


    function validDelegate(address identity, bytes32 delegateType, address actor) public view returns(bool) {
        if(identity == actor && !primaryAddressChanged[identity]){
            return true;
        }
        Delegates memory del = delegates[identity][delegateType];
        for(uint8 i; i < del.addresses.length; i++){
            if (del.addresses[i] == actor){
                return true;
            }
        }
        return false;
    }


    function quorumSatisfied(address identity, bytes32 delegateType, uint8 confirmations_count) public view returns(bool){
        uint8 quorum = delegates[identity][delegateType].requiredQuorum;
        //meaning it is a primary address and has never changed
        if (quorum == 0){
            quorum = 1;
        }
        return confirmations_count >=  quorum;
    }


    function submitAddDelegate(address identity, bytes32 delegateType, address delegate) public returns(uint){
        require(validDelegate(identity, delegateType, msg.sender));
        operationsCount += 1;
        operations[operationsCount] = AddDelegateOperation({
            executed: false,
            identity: identity,
            delegateType: delegateType,
            delegate: delegate,
            confirmationsCount: 0
        });
        confirmAddDelegateOperation(operationsCount);
        return operationsCount;
    }

    function confirmAddDelegateOperation(uint operationId) public {
        AddDelegateOperation storage op = operations[operationId];
        require(op.identity != address(0x0));
        require(validDelegate(op.identity, op.delegateType, msg.sender));
        require(confirmations[operationId][msg.sender] == false);

        confirmations[operationId][msg.sender] = true;
        op.confirmationsCount += 1;
        executeAddDelegateOperation(operationId);
    }

    //function revokeConfirmation

    function executeAddDelegateOperation(uint operationId) internal{
        AddDelegateOperation storage op = operations[operationId];
        require(!op.executed);
        if (quorumSatisfied(op.identity, op.delegateType, op.confirmationsCount)){
            Delegates storage del = delegates[op.identity][op.delegateType];
            del.addresses.push(op.delegate);
            del.delegateCount += 1;
            if (del.requiredQuorum == 0){
                del.requiredQuorum = DEFAULT_REQUIRED_QUORUM;
            }
        op.executed = true;
        }
    }

    //function revokeDelegate(address identity, address actor, bytes32 delegateType, address delegate) public onlyAuthorized(identity, actor) {




}
