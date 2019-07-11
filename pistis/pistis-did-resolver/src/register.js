import {
  registerMethod
} from 'did-resolver'
const Web3 = require('web3')
export const REGISTRY = '0x6dab0774488aeb8d733d8a01cea49dbd091eb0c9'
import DIDRegistryABI from '../contracts/pistis-did-registry.json'
import abi from 'ethjs-abi'

const PERMISSIONS = ['authentication', 'identityMgmt', 'statusRegMgmt', 'tcmMgmt']

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

export const delegateTypes = {
  Secp256k1SignatureAuthentication2018: stringToBytes32('authentication'),
  Secp256k1VerificationKey2018: stringToBytes32('authorization'),
}

export const attrTypes = {
  sigAuth: 'SignatureAuthentication2018',
  veriKey: 'VerificationKey2018',
}

export function wrapDidDocument(identity, primaryAddressChanged, history) {
  let counter = 0
  let did = 'did:pistis:' + identity
  let keyArrays = {
    'publicKey': [],
    'authentication': [],
    'identityMgmt': [],
    'statusRegMgmt': [],
    'tcmMgmt': []
  }

  if (!primaryAddressChanged) {
    keyArrays['publicKey'].push({
      id: `${did}#auth-${counter}`,
      type: 'Secp256k1VerificationKey2018',
      owner: did,
      ethereumAddress: identity
    })
    keyArrays['authentication'].push({
      type: 'Secp256k1SignatureAuthentication2018',
      publicKey: `${did}#auth-${counter}`,
    })
    keyArrays['identityMgmt'].push({
      id: `${did}#identityMgmt-${counter}`,
      type: 'EcdsaPublicKeySecp256k1',
      owner: did,
      ethereumAddress: identity
    })
    // statusRegManagement.push({
    //   id: `${did}#${PERMISSIONS[2]}-${counter}`,
    //   type: 'EcdsaPublicKeySecp256k1',
    //   owner: did,
    //   ethereumAddress: identity
    // })
    // tcmManagement.push({
    //   id: `${did}#${PERMISSIONS[3]}-${counter}`,
    //   type: 'EcdsaPublicKeySecp256k1',
    //   owner: did,
    //   ethereumAddress: identity
    // })
    counter++
  }

  let revokedDelegates = []

  for (let event of history) {
    console.log(event.delegate + ' - ' + event.previousChange)
    if (event._eventName == 'DIDDelegateChanged') {
      if (event.added && !revokedDelegates.includes(event.delegate)) {
        let permission = bytes32toString(event.permission)
        if (permission == 'authentication') {
          keyArrays['publicKey'].push({
            id: `did:pistis:${event.address}#auth-${counter}`,
            type: 'Secp256k1VerificationKey2018',
            owner: 'did:pistis:' + event.address,
            ethereumAddress: event.address
          })
          keyArrays['authentication'].push({
            type: 'Secp256k1SignatureAuthentication2018',
            publicKey: `did:pistis:${event.delegate}#auth-${counter}`,
          })
        } else {
          keyArrays[permission].push({
            id: `did:pistis:${event.delegate}#${permission}-${counter}`,
            type: 'EcdsaPublicKeySecp256k1',
            owner: 'did:pistis:' + event.delegate,
            ethereumAddress: event.delegate
          })
        }
        counter++
      } else {
        revokedDelegates.push(event.delegate)
      }
    }
  }

  let doc = {
    '@context': 'https://w3id.org/did/v1',
    id: 'did:pistis:' + identity,
    publicKey: keyArrays['publicKey'],
    authentication: keyArrays['authentication'],
    identityMgtm: keyArrays['identityMgmt']
  }

  console.log(doc)

  return doc
}


function parseDID(did) {
  if (did === '') throw new Error('Missing DID')
  const sections = did.match(/^did:([a-zA-Z0-9_]+):([[a-zA-Z0-9_.-]+)(\/[^#]*)?(#.*)?$/)
  if (sections) {
    const parts = {
      did: sections[0],
      method: sections[1],
      id: sections[2]
    }
    if (sections[1] != 'pistis') throw new Error(`Invalid Pistis DID ${did}`)
    if (sections[3]) parts.path = sections[3]
    if (sections[4]) parts.fragment = sections[4].slice(1)
    return parts
  }
  throw new Error(`Invalid Pistis DID ${did}`)
}


function configureProvider(conf = {}) {
  if (conf.provider) {
    return conf.provider
  } else if (conf.web3) {
    return conf.web3.currentProvider
  } else {
    return new Web3.providers.HttpProvider(conf.rpcUrl || 'https://mainnet.infura.io/ethr-did')
  }
}

export default function register(conf = {}) {
  const provider = configureProvider(conf)
  const web3 = new Web3(provider)
  const registryAddress = conf.registry || REGISTRY
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
        if (prev.lt(blockNumber)) {
          previousChange = event.previousChange
        }
      }
    }
    return history
  }


  async function resolve(did, parsed) {
    let mockAddr = '0x5e2397babcb4307ba6da8b1a602635dcaf8ebaa7'
    let mockDID = 'did:pistis:0x5e2397babcb4307ba6da8b1a602635dcaf8ebaa7'
    let primaryAddressChanged = await PistisDIDRegistry.methods.primaryAddressChanged(mockAddr).call()
    // data.authentication = await PistisDIDRegistry.methods.delegates(parsed.id, stringToBytes32(PERMISSIONS[0])).call()
    // data.identityManagement = await PistisDIDRegistry.methods.delegates('0x5e2397babcb4307ba6da8b1a602635dcaf8ebaa7', stringToBytes32(PERMISSIONS[1])).call()
    // const owner = await didReg.identityOwner(parsed.id)
    const history = await changeLog(mockAddr)
    console.log(history)
    return wrapDidDocument(mockAddr, primaryAddressChanged, history)
  }

  registerMethod('pistis', resolve)
}

// module.exports = register