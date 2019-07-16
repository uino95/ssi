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

    //addressParams[0] = executor
    //addressParams[1] = delegate
    //intParams[0] = added (if == 1)
    function execute(address identity, uint256[] memory intParams, string memory stringParams, address[] memory addressParams, bytes32[] memory bytesParams) public onlyMultiSigContract(msg.sender) returns (bool) {
        address delegate = addressParams[1];
        if(true){
            delegates[identity][addressParams[0]][delegate] = true;
            bool added = intParams[0] == 1;
            emit DIDDelegateChanged(identity, addressParams[0], delegate, added, blockChanged[identity]);
            blockChanged[identity] = block.number;
            if (minQuorum[identity] == 0){
                minQuorum[identity] = DEFAULT_REQUIRED_QUORUM;
            }
            //if the primary address is given permission different than this executor then no more delegates can be added to that identity
            if(identity == delegate && !primaryAddressChanged[identity]){
                primaryAddressChanged[identity] = true;
            }
        } else {
            //TODO
        }
        return true;
    }


}
