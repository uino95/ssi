import store from '../store'

const jsonInterface = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      },
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "minQuorum",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
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
    "name": "blockChanged",
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
        "type": "address"
      }
    ],
    "name": "primaryAddressChanged",
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
    "inputs": [],
    "name": "multiSigContract",
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
    "name": "DEFAULT_REQUIRED_QUORUM",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
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
      },
      {
        "name": "",
        "type": "address"
      },
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "delegates",
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
    "inputs": [
      {
        "name": "default_required_quorum",
        "type": "uint8"
      },
      {
        "name": "multiSigContract",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "identity",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "executor",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "delegate",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "added",
        "type": "bool"
      },
      {
        "indexed": false,
        "name": "previousChange",
        "type": "uint256"
      }
    ],
    "name": "DIDDelegateChanged",
    "type": "event"
  },
  {
    "constant": true,
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
        "name": "actor",
        "type": "address"
      }
    ],
    "name": "actorHasPermission",
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
        "name": "identity",
        "type": "address"
      },
      {
        "name": "executor",
        "type": "address"
      },
      {
        "name": "confirmationCount",
        "type": "uint8"
      }
    ],
    "name": "quorumSatisfied",
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
    "constant": false,
    "inputs": [
      {
        "name": "identity",
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
    "name": "execute",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

let web3
let pistisDIDRegistry

function fetchWeb3() {
  if(store === undefined){
    setTimeout(function () {
      console.log('store not ready yet. retrying in 1 second...')
      fetchWeb3()
    }, 1000)
  } else {
    web3 = store.state.web3.web3Instance == null ? null : store.state.web3.web3Instance()
    if (web3 == null) {
      setTimeout(function () {
        console.log('web3 not instanciated yet. retrying in 1 second...')
        fetchWeb3()
      }, 1000)
    } else {
      pistisDIDRegistry = new web3.eth.Contract(jsonInterface, store.state.contracts.pistisDIDRegistry)
    }
  }
}

fetchWeb3()

// TODO
export async function getMinQuorum(executor){
  const result = await pistisDIDRegistry.methods.minQuorum(store.state.identity, executor).call()
  return result
}

