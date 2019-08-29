import {
  registerMethod
} from 'did-resolver'
const Web3 = require('web3')
const PistisDIDRegistryAddress = '0x21a4AC9d0636ec192198D13b898B32ca26b6d1f6'
const CredentialStatusRegistryAddress = '0x5a4DbDd84185D8a71650bA578Ca3E0cFA49AA279'

import DIDRegistryABI from '../contracts/pistis-did-registry.json'
import abi from 'ethjs-abi'

import {
  Buffer
} from 'buffer'

export function bytes32toString(bytes32) {
  return Buffer.from(bytes32.slice(2), 'hex')
    .toString('utf8')
    .replace(/\0+$/, '')
}

export function stringToBytes32(str) {
  const buffstr =
    '0x' +
    Buffer.from(str)
    .slice(0, 32)
    .toString('hex')
  return buffstr + '0'.repeat(66 - buffstr.length)
}

export function wrapDidDocument(identity, primaryAddressChanged, history) {
  let counter = 0
  let did = 'did:pistis:' + identity
  let keyArrays = {
    'publicKey': [],
    'delegatesMgmt': [],
    'statusRegMgmt': [],
  }

  if (!primaryAddressChanged) {
    keyArrays['publicKey'].push({
      id: `${did}#auth-${counter}`,
      type: 'EcdsaPublicKeySecp256k1',
      owner: did,
      ethereumAddress: identity
    })
    keyArrays['delegatesMgmt'].push({
      type: 'Secp256k1SignatureAuthentication2018',
      publicKey: `${did}#auth-${counter}`,
    })
    keyArrays['statusRegMgmt'].push({
      id: `${did}#statusRegMgmt-${counter}`,
      type: 'EcdsaPublicKeySecp256k1',
      owner: did,
      ethereumAddress: identity
    })
    counter++
  }

  let revokedDelegates = {
    delegatesMgmt: [],
    statusRegMgmt: []
  }

  for (let event of history) {
    console.log(event.delegate + ' - ' + event.previousChange)
    if (event._eventName === 'DIDDelegateChanged') {
      if (event.added) {
        console.log(event.executor)
        if (event.executor == PistisDIDRegistryAddress.toLowerCase() && !revokedDelegates.delegatesMgmt.includes(event.delegate)) {
          keyArrays['publicKey'].push({
            id: `did:pistis:${event.delegate}#auth-${counter}`,
            type: 'EcdsaPublicKeySecp256k1',
            owner: 'did:pistis:' + event.delegate,
            ethereumAddress: event.delegate
          })
          keyArrays['delegatesMgmt'].push({
            type: 'Secp256k1SignatureAuthentication2018',
            publicKey: `did:pistis:${event.delegate}#auth-${counter}`,
          })
        } else if (event.executor == CredentialStatusRegistryAddress.toLowerCase() && !revokedDelegates.statusRegMgmt.includes(event.delegate)) {
          keyArrays['statusRegMgmt'].push({
            id: `did:pistis:${event.delegate}#credStatusReg-${counter}`,
            type: 'EcdsaPublicKeySecp256k1',
            owner: 'did:pistis:' + event.delegate,
            ethereumAddress: event.delegate
          })
        }
        counter++
      } else {
        if (event.executor == PistisDIDRegistryAddress.toLowerCase()) {
          revokedDelegates.delegatesMgmt.push(event.delegate)
        } else if (event.executor == CredentialStatusRegistryAddress.toLowerCase()) {
          revokedDelegates.statusRegMgmt.push(event.delegate)
        }
        counter++
      }
    }
  }

  let doc = {
    '@context': 'https://w3id.org/did/v1',
    id: 'did:pistis:' + identity,
    publicKey: keyArrays['publicKey'],
    delegatesMgmt: keyArrays['delegatesMgmt'],
    statusRegMgmt: keyArrays['statusRegMgmt'],
  }

  console.log('--------------------DOC------------------------')
  console.log(doc)

  return doc
}


function configureProvider(conf = {}) {
  if (conf.provider) {
    return conf.provider
  } else if (conf.web3) {
    return conf.web3.currentProvider
  } else {
    return new Web3.providers.WebsocketProvider(conf.rpcUrl || 'wss://ropsten.infura.io/ws/v3/935826ef66134c5883e24a003a92819a')
  }
}

export default function register(conf = {}) {
  const provider = configureProvider(conf)
  const web3 = new Web3(provider)
  const registryAddress = conf.registry || PistisDIDRegistryAddress
  const PistisDIDRegistry = new web3.eth.Contract(DIDRegistryABI, registryAddress)
  const logDecoder = abi.logDecoder(DIDRegistryABI, false)


  const lastChanged = async identity => {
    const result = await PistisDIDRegistry.methods.blockChanged(identity).call()
    if (result) {
      return result
    }
  }
  async function changeLog(identity) {
    const history = []
    let previousChange = await lastChanged(identity)
    while (previousChange) {
      console.log("prevChange ", previousChange.toString())
      const blockNumber = web3.utils.toBN(previousChange)
      const logs = await web3.eth.getPastLogs({
        address: registryAddress,
        topics: [null, `0x000000000000000000000000${identity.slice(2)}`],
        fromBlock: previousChange,
        toBlock: previousChange,
      })
      const events = logDecoder(logs)
      previousChange = undefined
      for (let event of events) {
        history.push(event)
        let prev = web3.utils.toBN(event.previousChange)
        console.log(prev.toString())
        if (prev.lt(blockNumber)) {
          previousChange = event.previousChange
        }
      }
    }
    return history
  }


  async function resolve(did, parsed) {
    if (!parsed.id.match(/^0x[0-9a-fA-F]{40}$/))
      throw new Error(`Not a valid pistis DID: ${did}`)
    let primaryAddressChanged = await PistisDIDRegistry.methods.primaryAddressChanged(parsed.id).call()
    const history = await changeLog(parsed.id)
    console.log('----------------History----------------------')
    console.log(history)
    return wrapDidDocument(parsed.id, primaryAddressChanged, history)
  }

  registerMethod('pistis', resolve)
}

// module.exports = register