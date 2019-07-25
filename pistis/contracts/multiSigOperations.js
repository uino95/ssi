import web3 from './web3_config.js'
const MultiSigOperationsABI = [{
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
import abi from 'ethjs-abi'
const constants = require('./constants');

const MultiSigOperationsContract = new web3.eth.Contract(MultiSigOperationsABI, constants.multiSigOperations)
const logDecoder = abi.logDecoder(MultiSigOperationsABI, false)

const lastChanged = async identity => {
  const result = await MultiSigOperationsContract.methods.lastOperationBlock(identity).call()
  if (result) {
    return result
  }
}

module.exports.latestBlockChecked = 1
module.exports.setLatestBlock = function (blockN) {
  this.latestBlockChecked = blockN
}

async function eventsLog(identity) {
  const history = []
  let previousChange = await lastChanged(identity)
  console.log(previousChange.toString())
  module.exports.setLatestBlock(parseInt(previousChange.toString()) + 1)
  while (previousChange) {
    const blockNumber = web3.utils.toBN(previousChange)
    const logs = await web3.eth.getPastLogs({
      address: constants.multiSigOperations,
      topics: [null, `0x000000000000000000000000${identity.slice(2)}`],
      fromBlock: previousChange,
      toBlock: previousChange,
    })
    const events = logDecoder(logs)
    previousChange = undefined
    for (let event of events) {
      history.push(event)
      let prev = web3.utils.toBN(event.lastOperationBlock)
      if (prev.lt(blockNumber)) {
        previousChange = event.lastOperationBlock
      }
    }
  }
  console.log(history)
  return history
}

function filterPendingOnly(history) {
  let pendingOpIds = []
  for (let event of history) {
    if (event._eventName == 'Submission') {
      pendingOpIds.push(web3.utils.toBN(event.operationId))
    }
  }
  for (let event of history) {
    if (event._eventName == 'Execution') {
      let bn = web3.utils.toBN(event.operationId)
      pendingOpIds = pendingOpIds.filter(function (e) {
        return !(e.eq(bn))
      })
    }
  }
  return pendingOpIds
}

async function fetchOperationData(opId) {
  const op = await MultiSigOperationsContract.methods.operations(opId).call()
  return {
    confirmationsCount: op.confirmationsCount,
    executor: op.executor,
    opId: opId,
    //TODO future improvements to add operation params
  }
}

//also filter by executor
// async function fetchPendingOperationsByExecutor(identity, executor) {
//   identity = identity.toLowerCase()
//   executor = executor.toLowerCase()
//   const history = await eventsLog(identity)
//   console.log("fetch history of executor", executor)
//   console.log(history)
//   const pendingIds = filterPendingOnly(history)
//   let operations = []
//   for (let opId of pendingIds) {
//     operations.push(await fetchOperationData(parseInt(opId.toString(0))))
//   }
//   console.log("fetch operations of executor", executor)
//   console.log(operations)
//   return operations
// }


module.exports.watchEvents = async function (identity) {
  console.log('--------->' + this.latestBlockChecked)
  identity = identity.toLowerCase()
  let previousChange = await lastChanged(identity)
  if (web3.utils.toBN(previousChange).gt(web3.utils.toBN(this.latestBlockChecked))) {
    console.log('---------------- WATCH STARTED ------------- latestBlockChecked:' + this.latestBlockChecked)
    const CONFIRMATION = '0x817694a005a7dd137f16ac53499d2f19c6ec10cbd95cc9b207797a8c03a6e18a'
    let logs = await web3.eth.getPastLogs({
      address: constants.multiSigOperations,
      topics: [CONFIRMATION, `0x000000000000000000000000${identity.slice(2)}`],
      fromBlock: web3.utils.toBN(this.latestBlockChecked),
      toBlock: previousChange,
    })
    let events = logDecoder(logs)
    let pendingOperationsChanged = events.length > 0
    console.log('preivous changed:' + previousChange)
    console.log(events)

    if (!pendingOperationsChanged) {
      //TODO change address
      const REVOCATION = '0x747d2854f26cb258f667941f2c7bfda21eb606dcd0c657010c4bb6cd4c757ce3'
      logs = await web3.eth.getPastLogs({
        address: constants.multiSigOperations,
        topics: [REVOCATION, `0x000000000000000000000000${identity.slice(2)}`],
        fromBlock: web3.utils.toBN(this.latestBlockChecked),
        toBlock: previousChange,
      })
      events = logDecoder(logs)
      pendingOperationsChanged = events.length > 0
    }

    const EXECUTION = '0xcf741dc81a7cedc9db83d928e5fccaf376bdaec5880c65b16e625aa0b15c48a7'
    logs = await web3.eth.getPastLogs({
      address: constants.multiSigOperations,
      topics: [EXECUTION, `0x000000000000000000000000${identity.slice(2)}`, `0x000000000000000000000000${constants.pistisDIDRegistry.slice(2)}`],
      fromBlock: web3.utils.toBN(this.latestBlockChecked),
      toBlock: previousChange,
    })
    events = logDecoder(logs)
    let didDocChanged = events.length > 0

    return {
      pendingOperationsChanged: pendingOperationsChanged,
      didDocChanged: didDocChanged
    }
  } else if (module.exports.latestBlockChecked === 0) {
    console.log('first timerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr' + this.latestBlockChecked)
    module.exports.setLatestBlock(0)
    return {
      pendingOperationsChanged: true,
      didDocChanged: true
    }
  } else {
    return {}
  }
}

module.exports.fetchPendingOperations = async function (identity) {
  identity = identity.toLowerCase()
  let operations = []
  const history = await eventsLog(identity)
  console.log(history)
  const pendingIds = filterPendingOnly(history)
  for (let opId of pendingIds) {
     operations.push(await fetchOperationData(parseInt(opId.toString(0))))
  }
  return operations
}