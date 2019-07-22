pragma solidity ^0.5.0;

import './PermissionRegistry.sol';

/// @title DID Registry - Enforcing multi sig operations on W3C based DID standard registry
/// @author Andrea Taglia - <drew.taglia@gmail.com>
contract PistisDIDRegistry is PermissionRegistry {

    /**
    Events
    */
    event DIDDelegateChanged(
        address indexed identity,
        address executor,
        address delegate,
        bool added,
        uint previousChange
    );

    /**
    Storage
    */

    /// @notice for each identity maps parmissions (i.e. executors address) to those addresses who have it granted.
    mapping(address => mapping(address => mapping(address => bool))) public delegates;
    mapping(address => bool) public primaryAddressChanged;
    mapping(address => mapping(address => uint8)) public minQuorum;
    mapping(address => uint) public blockChanged;
    uint8 public DEFAULT_REQUIRED_QUORUM;

    /**
    Constructor
    */
    constructor(uint8 default_required_quorum, address multiSigContract) PermissionRegistry(multiSigContract) public {
        DEFAULT_REQUIRED_QUORUM = default_required_quorum;
    }

    /**
    Public Functions
    */

    /// @param identity (address)
    /// @param executor (address)
    /// @param confirmationCount (uint8)
    /// @return  (bool)
    function actorHasPermission(address identity, address executor, address actor) public view returns(bool) {
        if(identity == actor && !primaryAddressChanged[identity]){
            return true;
        }
        return delegates[identity][executor][actor];
    }

    /// @param identity (address)
    /// @param executor (address)
    /// @param confirmationCount (uint8)
    /// @return  (bool)
    function quorumSatisfied(address identity, address executor, uint8 confirmationCount) public view returns(bool){
        uint8 quorum = minQuorum[identity][executor];
        //meaning it is a primary address and has never changed
        if (quorum == 0) {
            quorum = 1;
        }
        return confirmationCount >= quorum;
    }

    //addressParams[0] = delegate
    //addressParams[1] = permission
    //intParams[0] = added (if == 1)

    /// @dev execute function
    /// @param identity (address)
    /// @param executor (address)
    /// @param confirmationCount (uint8)
    /// @return  (bool)
    function execute(address identity, uint256[] memory intParams, string memory stringParams, address[] memory addressParams, bytes32[] memory bytesParams) public returns (bool) {
        //should require params are set
        super.execute(identity, intParams, stringParams, addressParams, bytesParams);
        address delegate = addressParams[0];
        address permission = addressParams[1];
        //add (1) or remove (2) a delegate
        bool added = intParams[0] == 1;
        delegates[identity][permission][delegate] = added;
        emit DIDDelegateChanged(identity, permission, delegate, added, blockChanged[identity]);
        blockChanged[identity] = block.number;
        if (minQuorum[identity][permission] == 0) {
            minQuorum[identity][permission] = DEFAULT_REQUIRED_QUORUM;
        }
        //if the primary address is given permission different than this executor then no more delegates can be added to that identity
        if(!primaryAddressChanged[identity] && identity == delegate){
            primaryAddressChanged[identity] = true;
        }
        return true;
    }
}


