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
    /// @notice count delegates per identity
    mapping(address => mapping(address => uint)) public delegatesCount;
    /// @notice needed to check whether the primary address associated to that identity is still the trivial delegate or not
    mapping(address => bool) public primaryAddressChanged;
    /// @notice minimum quorum required to perform a certain operation per identity and per executor
    mapping(address => mapping(address => uint8)) public minQuorum;
    /// @notice latest update made on an identity. Needed to wrap the DID Document
    mapping(address => uint) public blockChanged;
    uint8 public DEFAULT_REQUIRED_QUORUM;

    /**
    Constructor
    */
    /// @param defaultRequiredQuorum (uint8) default quorum for operations
    /// @param multiSigContract (address) address of the multiSigOperations contract to handle multi sig updates on this contract structure
    constructor(uint8 defaultRequiredQuorum, address multiSigContract) PermissionRegistry(multiSigContract) public {
        DEFAULT_REQUIRED_QUORUM = defaultRequiredQuorum;
    }

    /**
    Public Functions
    */
    /// @param identity (address) identity to check permissions for
    /// @param executor (address) executor to check permissions for
    /// @param actor (address) acot to check permissions for
    /// @return  (bool) whether the actor has permission relative to that identity for that executor
    function actorHasPermission(address identity, address executor, address actor) public view returns(bool) {
        if(identity == actor && !primaryAddressChanged[identity]){
            return true;
        }
        return delegates[identity][executor][actor];
    }

    /// @param identity (address) identity to check quorum for
    /// @param executor (address) executor address to check quorum for
    /// @param confirmationCount (uint8) how many confirmations
    /// @return  (bool) whether the quorum is reached
    function quorumSatisfied(address identity, address executor, uint8 confirmationCount) public view returns(bool){
        if (minQuorum[identity][executor] == 0) {
            return confirmationCount >= 1;
        }
        return confirmationCount >= minQuorum[identity][executor];
    }

    /// @dev can either add or remove a delegate depeding on intParams[0]
    /// @notice you can't remove a delegate with the current contract permission if it is the last one as it would make the identity unusable from that point onward
    /// @param identity (address) identity relative to changes to make
    /// @param intParams (uint256[]) index 0 has to carry 1 if delegate addition, anything else otherwise. other indexes not used
    /// @param stringParams (string) not used
    /// @param addressParams (address[]) index 0 has to carry the ethereum address of the delegate to changed state for. index 1 has to carry the executor address relative to the change
    /// @param bytesParams (bytes32[]) not used
    /// @return  (bool) true if everything went well
    function execute(address identity, uint256[] memory intParams, string memory stringParams, address[] memory addressParams, bytes32[] memory bytesParams) public returns (bool) {
        super.execute(identity, intParams, stringParams, addressParams, bytesParams);
        address delegate = addressParams[0];
        address permission = addressParams[1];
        bool added = intParams[0] == 1;
        delegates[identity][permission][delegate] = added;
        if (added) {
            delegatesCount[identity][permission] += 1;
            if(getDelegatesCount(identity, permission) >= DEFAULT_REQUIRED_QUORUM){
                minQuorum[identity][permission] = DEFAULT_REQUIRED_QUORUM;
            }
        } else {
            uint delCount = getDelegatesCount(identity, permission);
            require(!(permission == address(this) && delCount == 1), "you can't remove this last delegate as the identity would be unusable after this operation");
            delegatesCount[identity][permission] -= 1;
            if(getDelegatesCount(identity, permission) < DEFAULT_REQUIRED_QUORUM){
                minQuorum[identity][permission] = 0;
            }
        }
        if(!primaryAddressChanged[identity] && identity == delegate){
            primaryAddressChanged[identity] = true;
        }
        emit DIDDelegateChanged(identity, permission, delegate, added, blockChanged[identity]);
        blockChanged[identity] = block.number;
        return true;
    }

    /**
    Internal Functions
    */
    /// @param identity (address) identity to count number of delegates for
    /// @param permission (address) executor address to count number of delegates for
    function getDelegatesCount(address identity, address permission) internal view returns(uint){
        uint count = delegatesCount[identity][permission];
        if (!primaryAddressChanged[identity]) {
            count += 1;
        }
        return count;
    }
}