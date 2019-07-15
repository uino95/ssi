pragma solidity ^0.5.0;

contract PermissionRegistry is PermissionRegistry, OperationExecutor{

    //Storage

    //for each identity maps parmissions to those addresses who have it granted
    mapping(address => mapping(uint256 => mapping(address => bool))) public delegates;
    mapping(address => bool) public primaryAddressChanged;
    mapping(address => uint8) public minQuorum;
    uint8 DEFAULT_REQUIRED_QUORUM;
    bool isMultiSigSet;
    address deployer;
    address multiSigContract;

    //Constructor
    constructor(uint8 default_required_quorum) public {
        DEFAULT_REQUIRED_QUORUM = default_required_quorum;
        deployer = msg.sender;
    }


    // PermissionRegistry
    function setMultiSigOperations(address addr){
        require(msg.sender == depoyer, "only deployer");
        require(!isMultiSignSet, "only one time allowed");
        multiSigContract = MultiSigContract(addr);
        isMultiSignSet = true;
    }

    function actorHasPermission(address identity, uint256 permission, address actor) public view returns(bool) {
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
    // function registerNewPermission()


    //function revokeConfirmation

    // function add

    function execute (address identity, uint256[] memory intParams, string memory stringParams, address[] memory addressParams) public {
        require(msg.sender == multiSigContract, "only multi sig contract can call it");
        if(intParams[0] == keccak256("addDelegate")){
            delegates[identity][permissions[intParams[0]]][parmas[0]] = true;
            emit DIDDelegateChanged(identity, op.permission, op.delegate, op.add, blockChanged[identity]);
            blockChanged[identity] = block.number;
            if (minQuorum[identity] == 0){
                minQuorum[identity] = DEFAULT_REQUIRED_QUORUM;
            }
            if(identity == op.delegate && !primaryAddressChanged[identity]){
                primaryAddressChanged[identity] = true;
            }
        } else {
            //TODO
        }
    }


}
