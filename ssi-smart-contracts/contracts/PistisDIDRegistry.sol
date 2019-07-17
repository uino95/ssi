pragma solidity ^0.5.0;

import './PermissionRegistry.sol';

contract PistisDIDRegistry is PermissionRegistry {

    //Storage

    //for each identity maps parmissions (i.e. executors address) to those addresses who have it granted
    mapping(address => mapping(address => mapping(address => bool))) public delegates;
    mapping(address => bool) public primaryAddressChanged;
    mapping(address => uint8) public minQuorum;
    mapping(address => uint) public blockChanged;

    uint8 public DEFAULT_REQUIRED_QUORUM;

    //Constructor
    constructor(uint8 default_required_quorum, address multiSigContract) PermissionRegistry(multiSigContract) public {
        DEFAULT_REQUIRED_QUORUM = default_required_quorum;
    }

    //Events
    event DIDDelegateChanged(
        address indexed identity,
        address executor,
        address delegate,
        bool added,
        uint previousChange
    );

    function actorHasPermission(address identity, address executor, address actor) public view returns(bool) {
        if(identity == actor && !primaryAddressChanged[identity]){
            return true;
        }
        return delegates[identity][executor][actor];
    }
    function quorumSatisfied(address identity, uint8 confirmationCount) public view returns(bool){
        uint8 quorum = minQuorum[identity];
        //meaning it is a primary address and has never changed
        if (quorum == 0) {
            quorum = 1;
        }
        return confirmationCount >= quorum;
    }

    //addressParams[1] = delegate
    //addressParams[2] = permission
    //intParams[0] = added (if == 1)
    function execute(address identity, uint256[] memory intParams, string memory stringParams, address[] memory addressParams, bytes32[] memory bytesParams) public returns (bool) {
        //should require params are set
        super.execute(identity, intParams, stringParams, addressParams, bytesParams);
        address permission = addressParams[2];
        address delegate = addressParams[1];
        //add (1) or remove (2) a delegate
        bool added = intParams[0] == 1;
        delegates[identity][permission][delegate] = added;
        emit DIDDelegateChanged(identity, permission, delegate, added, blockChanged[identity]);
        blockChanged[identity] = block.number;
        if (minQuorum[identity] == 0){
            minQuorum[identity] = DEFAULT_REQUIRED_QUORUM;
        }
        //if the primary address is given permission different than this executor then no more delegates can be added to that identity
        if(!primaryAddressChanged[identity] && identity == delegate){
            primaryAddressChanged[identity] = true;
        }
        return true;
    }


}
