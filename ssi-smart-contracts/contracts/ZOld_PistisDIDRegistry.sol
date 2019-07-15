pragma solidity ^0.5.0;

contract PistisDIDRegistry {

    //Storage
    mapping(address => mapping(bytes32 => mapping(address => bool))) public delegates;
    mapping(address => uint8) public minQuorum;
    mapping(address => bool) public primaryAddressChanged;
    mapping(address => uint) public blockChanged;
    
    mapping(uint => mapping(address => bool)) public confirmations;
    mapping(uint => ChangeDelegateOperation) public operations;
    uint public operationsCount;

    // Constans
    bytes32 public constant AUTH_PERMISSION = "authentication";
    bytes32 public constant IDENTITY_MANAGEMENT_PERMISSION = "identityMgmt";
    uint8 constant DEFAULT_REQUIRED_QUORUM = 2;

    //Events
    event DIDDelegateChanged(
        address indexed identity,
        bytes32 permission,
        address delegate,
        bool added,
        uint previousChange
    );
    event DIDAttributeChanged(
        address indexed identity,
        bytes32 name,
        bytes value,
        uint validTo,
        uint previousChange
      );

    //Structs
    struct ChangeDelegateOperation {
        bool executed;
        uint8 confirmationsCount;

        address identity;
        bytes32 permission;
        address delegate;
        bool add;
    }


    // PermissionRegistry
    function actorHasPermission(address identity, bytes32 permission, address actor) public view returns(bool) {
        if(identity == actor && !primaryAddressChanged[identity]){
            return true;
        }
        return delegates[identity][permission][actor];
    }
    function quorumSatisfied(address identity, uint8 confirmations_count) public view returns(bool){
        uint8 quorum = minQuorum[identity];
        //meaning it is a primary address and has never changed
        if (quorum == 0) {
            quorum = 1;
        }
        return confirmations_count >= quorum;
    }


    function submitAddDelegate(address identity, bytes32 permission, address delegate) public returns(uint){
        require(actorHasPermission(identity, IDENTITY_MANAGEMENT_PERMISSION, msg.sender));
        operationsCount += 1;
        operations[operationsCount] = ChangeDelegateOperation({
            executed: false,
            identity: identity,
            permission: permission,
            delegate: delegate,
            add: true,
            confirmationsCount: 0
        });
        confirmAddDelegateOperation(operationsCount);
        return operationsCount;
    }

    function confirmAddDelegateOperation(uint operationId) public {
        ChangeDelegateOperation storage op = operations[operationId];
        require(op.identity != address(0x0));
        require(actorHasPermission(op.identity, IDENTITY_MANAGEMENT_PERMISSION, msg.sender));
        require(confirmations[operationId][msg.sender] == false);

        confirmations[operationId][msg.sender] = true;
        op.confirmationsCount += 1;
        executeAddDelegateOperation(operationId);
    }

    //function revokeConfirmation

    function executeAddDelegateOperation(uint operationId) internal{
        ChangeDelegateOperation storage op = operations[operationId];
        require(!op.executed);
        if (quorumSatisfied(op.identity, op.confirmationsCount)){
            delegates[op.identity][op.permission][op.delegate] = true;
            emit DIDDelegateChanged(op.identity, op.permission, op.delegate, op.add, blockChanged[op.identity]);
            blockChanged[op.identity] = block.number;
            
            if (minQuorum[op.identity] == 0){
                minQuorum[op.identity] = DEFAULT_REQUIRED_QUORUM;
            }
            if(op.identity == op.delegate && !primaryAddressChanged[op.identity]){
                primaryAddressChanged[op.identity] = true;
            }
        op.executed = true;
        }
    }

}
