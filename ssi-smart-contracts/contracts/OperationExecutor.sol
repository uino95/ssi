pragma solidity ^0.5.1;

contract OperationExecutor {

address multiSigContract;

modifier onlyMultiSigContract(address _addr){
    require(_addr == multiSigContract, "onyl multisigcontract can execute it");
    _;
}

constructor(address contract_address) public {
    multiSigContract = contract_address;
}

function execute(address identity, uint256[] memory intParams, string memory stringParams, address[]memory addressParams, bytes32[] bytesParams) public onlyMultiSigContract(msg.sender) returns (bool);

}