pragma solidity ^0.5.1;

/// @title Opeation Executor abstract contract
/// @notice Extending this contract allows executing operations in a multi sig manner
/// @author Andrea Taglia - <drew.taglia@gmail.com>
contract OperationExecutor {

    /// @notice address of the multiSigOperations contract which will be the only one able to call the execute function once an operations has reached enough confirmations
    address public multiSigContract;


    /// @dev needs to set the MultiSigOperations contract address in order for the contract to be functioning
    /// @param _multiSigContract (address) address of the MultiSigOperations contract
    constructor(address _multiSigContract) public {
        multiSigContract = _multiSigContract;
    }

    /// @dev this is the only function that will be called from the MultiSigOperations contract. If multiple operations have to be executed use one param to select one or another
    /// @param identity (address) identity subject of the operation to be executed
    /// @param intParams () generic integer parameters for the operation
    /// @param stringParams (string) generic string parameter for the operation
    /// @param addressParams () generic address parameters for the operation
    /// @param bytesParams () generic bytes parameters for the operation
    /// @return  (bool) whether the execution was successfull or not
    function execute(address identity, uint256[] memory intParams, string memory stringParams, address[] memory addressParams, bytes32[] memory bytesParams) public returns (bool) { 
        require(msg.sender == multiSigContract, "only multisigcontract can execute it");
    }

}
