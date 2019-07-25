import store from '../store'

const jsonInterface = [{
    "constant": true,
    "inputs": [],
    "name": "operationsCount",
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
      "name": "",
      "type": "address"
    }],
    "name": "lastOperationBlock",
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
    "name": "operations",
    "outputs": [{
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
    "name": "deployer",
    "outputs": [{
      "name": "",
      "type": "address"
    }],
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
    "inputs": [{
        "indexed": true,
        "name": "identity",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
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
    "inputs": [{
        "indexed": true,
        "name": "identity",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
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
    "inputs": [{
        "indexed": true,
        "name": "identity",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
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
    "inputs": [{
        "indexed": true,
        "name": "identity",
        "type": "address"
      },
      {
        "indexed": false,
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
    "inputs": [{
      "name": "registryAddress",
      "type": "address"
    }],
    "name": "setPermissionRegistry",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{
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
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{
      "name": "opId",
      "type": "uint256"
    }],
    "name": "confirmOperation",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{
      "name": "opId",
      "type": "uint256"
    }],
    "name": "revokeConfirmation",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

let web3
let multiSigOperations

function fetchWeb3() {
  web3 = store.state.web3.web3Instance == null ? null : store.state.web3.web3Instance()
  if (web3 == null) {
    setTimeout(function () {
      console.log('web3 not instanciated yet. retrying in 1 second...')
      fetchWeb3()
    }, 1000)
  } else {
    multiSigOperations = new web3.eth.Contract(jsonInterface, store.state.contracts.multiSigOperations)
  }
}
fetchWeb3()


export async function submitAddDelegate(data) {
  console.log(data)
  multiSigOperations.methods.submitOperation(data.identity, store.state.contracts.pistisDIDRegistry, [1], '', [data.delegate, data.permission], []).send({
    from: data.from
  }, (err, transactionHash) => {
    if (!err) {
      console.log(transactionHash);
    } else {
      store.commit('stopLoading', {
        type: 'mainOperationLoading'
      })
    }
  })
}

export async function submitRevokeDelegate(data) {
  console.log(data)
  multiSigOperations.methods.submitOperation(data.identity, store.state.contracts.pistisDIDRegistry, [2], '', [data.delegate, data.permission], []).send({
    from: data.from
  }, (err, transactionHash) => {
    if (!err) {
      console.log(transactionHash);
    } else {
      store.commit('stopLoading', {
        type: 'mainOperationLoading'
      })
    }
  })
}

export async function submitSetCredentialStatus(data) {
  console.log(data)

  multiSigOperations.methods.submitOperation(data.identity, store.state.contracts.credentialStatusRegistry, [data.credentialId, data.credentialStatus], '', [], [web3.utils.fromAscii(data.statusReason)]).send({
    from: data.from
  }, (err, transactionHash) => {
    if (!err) {
      console.log(transactionHash);
    } else {
      store.commit('stopLoading', {
        type: 'mainOperationLoading'
      })
    }
  })
}

export async function confirmOperation(opId, from, executorType) {
  console.log(opId)

  multiSigOperations.methods.confirmOperation(opId).send({
    from: from
  }, (err, transactionHash) => {
    if (!err) {
      console.log(transactionHash);
    } else {
      store.commit('stopLoading', {
        type: executorType,
        opId: opId
      })
    }
  })
}

export async function revokeConfirmation(opId, from, executorType) {

  multiSigOperations.methods.revokeConfirmation(opId).send({
    from: from
  }, (err, transactionHash) => {
    if (!err) {
      console.log(transactionHash);
    } else {
      store.commit('stopLoading', {
        type: executorType,
        opId: opId
      })
    }
  })
}

export async function hasConfirmed(opId, address) {
  return multiSigOperations.methods.confirmations(opId, address).call()
}