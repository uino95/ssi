const Web3 = require('web3')

const jsonInterface = [{
        "constant": false,
        "inputs": [{
            "name": "owner",
            "type": "address"
        }],
        "name": "addOwner",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
            "name": "_required",
            "type": "uint256"
        }],
        "name": "changeRequirement",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
            "name": "transactionId",
            "type": "uint256"
        }],
        "name": "confirmTransaction",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
            "name": "transactionId",
            "type": "uint256"
        }],
        "name": "executeTransaction",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
            "name": "owner",
            "type": "address"
        }],
        "name": "removeOwner",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
                "name": "owner",
                "type": "address"
            },
            {
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "replaceOwner",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
            "name": "transactionId",
            "type": "uint256"
        }],
        "name": "revokeConfirmation",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
                "name": "destination",
                "type": "address"
            },
            {
                "name": "value",
                "type": "uint256"
            },
            {
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "submitTransaction",
        "outputs": [{
            "name": "transactionId",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
                "name": "_owners",
                "type": "address[]"
            },
            {
                "name": "_required",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": true,
                "name": "sender",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "transactionId",
                "type": "uint256"
            }
        ],
        "name": "Confirmation",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": true,
                "name": "sender",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "transactionId",
                "type": "uint256"
            }
        ],
        "name": "Revocation",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "name": "transactionId",
            "type": "uint256"
        }],
        "name": "Submission",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "name": "transactionId",
            "type": "uint256"
        }],
        "name": "Execution",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "name": "transactionId",
            "type": "uint256"
        }],
        "name": "ExecutionFailure",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": true,
                "name": "sender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Deposit",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "name": "owner",
            "type": "address"
        }],
        "name": "OwnerAddition",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "name": "owner",
            "type": "address"
        }],
        "name": "OwnerRemoval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{
            "indexed": false,
            "name": "required",
            "type": "uint256"
        }],
        "name": "RequirementChange",
        "type": "event"
    },
    {
        "constant": true,
        "inputs": [{
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "address"
            }
        ],
        "name": "confirmations",
        "outputs": [{
            "name": "",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{
            "name": "transactionId",
            "type": "uint256"
        }],
        "name": "getConfirmationCount",
        "outputs": [{
            "name": "count",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{
            "name": "transactionId",
            "type": "uint256"
        }],
        "name": "getConfirmations",
        "outputs": [{
            "name": "_confirmations",
            "type": "address[]"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getOwners",
        "outputs": [{
            "name": "",
            "type": "address[]"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{
                "name": "pending",
                "type": "bool"
            },
            {
                "name": "executed",
                "type": "bool"
            }
        ],
        "name": "getTransactionCount",
        "outputs": [{
            "name": "count",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{
                "name": "from",
                "type": "uint256"
            },
            {
                "name": "to",
                "type": "uint256"
            },
            {
                "name": "pending",
                "type": "bool"
            },
            {
                "name": "executed",
                "type": "bool"
            }
        ],
        "name": "getTransactionIds",
        "outputs": [{
            "name": "_transactionIds",
            "type": "uint256[]"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{
            "name": "transactionId",
            "type": "uint256"
        }],
        "name": "isConfirmed",
        "outputs": [{
            "name": "",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{
            "name": "",
            "type": "address"
        }],
        "name": "isOwner",
        "outputs": [{
            "name": "",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "MAX_OWNER_COUNT",
        "outputs": [{
            "name": "",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{
            "name": "",
            "type": "uint256"
        }],
        "name": "owners",
        "outputs": [{
            "name": "",
            "type": "address"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "required",
        "outputs": [{
            "name": "",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "transactionCount",
        "outputs": [{
            "name": "",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{
            "name": "",
            "type": "uint256"
        }],
        "name": "transactions",
        "outputs": [{
                "name": "destination",
                "type": "address"
            },
            {
                "name": "value",
                "type": "uint256"
            },
            {
                "name": "data",
                "type": "bytes"
            },
            {
                "name": "executed",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
]
const contract_address = "0x8f110cfcc1917af5a537d640c3f4d22cf95b7efa"

const web3 = new Web3(Web3.providers.WebsocketProvider("https://ropsten.infura.io/v3/9b3e31b76db04cf2a6ff7ed0f1592ab9"))

const multiSigContract = new web3.eth.Contract(jsonInterface, contract_address)

async function createAndSignTransaction() {
    var data = multiSigContract.methods.addOwner("0x3d0de728e05260ffe6c1df8e3e5fa5b3df15f095").encodeABI();
    const tx = await web3.eth.accounts.signTransaction({
        nonce: 56484839,
        to: contract_address,
        gas: 2000000,
        data: data
    }, "7f1860fd21ca547197aef14709483fa56491c5b13e95586452267b285dc9b65b")
    console.log(tx.rawTransaction)
}

createAndSignTransaction()