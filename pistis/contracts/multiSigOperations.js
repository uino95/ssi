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
  }
]
import abi from 'ethjs-abi'
const constants = require('./constants');

const MultiSigOperations = new web3.eth.Contract(MultiSigOperationsABI, constants.multiSigOperations)
const logDecoder = abi.logDecoder(MultiSigOperationsABI, false)

const lastChanged = async identity => {
  const result = await MultiSigOperations.methods.lastOperationBlock(identity).call()
  if (result) {
    return result
  }
}

async function eventsLog(identity, executor) {
  const history = []
  let previousChange = await lastChanged(identity)
  while (previousChange) {
    const blockNumber = web3.utils.toBN(previousChange)
    const logs = await web3.eth.getPastLogs({
      address: constants.multiSigOperations,
      topics: [null, `0x000000000000000000000000${identity.slice(2)}`, `0x000000000000000000000000${executor.slice(2)}`],
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
  const op = await MultiSigOperations.methods.operations(opId).call()
  return {
    confirmationsCount: op.confirmationsCount,
    executor: op.executor,
    opId: opId,
    //TODO future improvements to add operation params
  }
}

//also filter by executor
async function fetchPendingOperationsByExecutor(identity, executor) {
  identity = identity.toLowerCase()
  executor = executor.toLowerCase()
  const history = await eventsLog(identity, executor)
  console.log(history)
  const pendingIds = filterPendingOnly(history)
  console.log(pendingIds)
  let operations = []
  for (let opId of pendingIds) {
    operations.push(await fetchOperationData(parseInt(opId.toString(0))))
  }
  console.log("pending", operations)
  return operations
}

module.exports = {
  fetchPendingOperations: async function (identity) {
    identity = identity.toLowerCase()
    let operations = []
    const executors = [constants.pistisDIDRegistry, constants.multiSigOperations, constants.credentialStatusRegistry]

    for (let executor of executors) {
      operations.concat(await fetchPendingOperationsByExecutor(identity, executor))
    }

    console.log("ops", operations)
    return operations
  },
  watchEvents: async function (identity) {
    return await MultiSigOperations.events.allEvents({
      filter: {
        identity: identity.toLowerCase(),
      }
    })
  }
}