import Web3 from 'web3'
import store from '../store'

const jsonInterface = [
    {
      "constant": true,
      "inputs": [],
      "name": "operationsCount",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        },
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "confirmations",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "lastOperationBlock",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "operations",
      "outputs": [
        {
          "name": "identity",
          "type": "address"
        },
        {
          "name": "executed",
          "type": "bool"
        },
        {
          "name": "confirmationsCount",
          "type": "uint8"
        },
        {
          "name": "executor",
          "type": "address"
        },
        {
          "name": "stringParams",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "permissionRegistry",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "deployer",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "operationId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "name": "executor",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "lastOperationBlock",
          "type": "uint256"
        }
      ],
      "name": "Submission",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "operationId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "name": "executor",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "lastOperationBlock",
          "type": "uint256"
        }
      ],
      "name": "Confirmation",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "operationId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "name": "executor",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "lastOperationBlock",
          "type": "uint256"
        }
      ],
      "name": "Revocation",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "operationId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "name": "executor",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "lastOperationBlock",
          "type": "uint256"
        }
      ],
      "name": "Execution",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "registryAddress",
          "type": "address"
        }
      ],
      "name": "setPermissionRegistry",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "identity",
          "type": "address"
        },
        {
          "name": "executor",
          "type": "address"
        },
        {
          "name": "intParams",
          "type": "uint256[]"
        },
        {
          "name": "stringParams",
          "type": "string"
        },
        {
          "name": "addressParams",
          "type": "address[]"
        },
        {
          "name": "bytesParams",
          "type": "bytes32[]"
        }
      ],
      "name": "submitOperation",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "opId",
          "type": "uint256"
        }
      ],
      "name": "confirmOperation",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]

const contract_address = store.state.contracts.multiSigOperations
const pistisDIDRegistryAddress = store.state.contracts.pistisDIDRegistry

const web3 = new Web3(Web3.givenProvider || null)

const multiSigOperations = new web3.eth.Contract(jsonInterface, contract_address)

export async function submitAddDelegate(data) {
    console.log(data)
    multiSigOperations.methods.submitOperation(data.identity, pistisDIDRegistryAddress, [1], '', [data.delegate, data.permission], []).send({from: data.from})
} 

export async function submitRevokeDelegate(data){
    multiSigOperations.methods.submitOperation(data.identity, pistisDIDRegistryAddress, [2], '', [data.delegate, data.permission], []).send({from: data.from})
}

export async function submitSetCredentialStatus(data) {} 

export async function confirmOperation(opId, sender){
    console.log(opId)
    multiSigOperations.methods.confirmOperation(opId).send({from: sender})
}