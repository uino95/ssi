pragma solidity ^0.5.1;

contract OperationExecutor {

address public multiSigContract;


constructor(address contract_address) public {
    multiSigContract = contract_address;
}

function execute(address identity, uint256[] memory intParams, string memory stringParams, address[] memory addressParams, bytes32[] memory bytesParams) public returns (bool) { 
    require(msg.sender == multiSigContract, "onyl multisigcontract can execute it");
}

}