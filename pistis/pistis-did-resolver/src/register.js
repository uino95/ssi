import {
  registerMethod
} from 'did-resolver'
const Web3 = require('web3')
export const REGISTRY = '0x2bDF7A8b9aE08155aD1CB0F7abf3A9780cE3EEFB'
import DIDRegistryABI from '../contracts/pistis-did-registry.json'

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
  Secp256k1SignatureAuthentication2018: stringToBytes32('sigAuth'),
  Secp256k1VerificationKey2018: stringToBytes32('veriKey'),
}

export const attrTypes = {
  sigAuth: 'SignatureAuthentication2018',
  veriKey: 'VerificationKey2018',
}

export function wrapDidDocument(did, owner, history) {
  const now = new BN(Math.floor(new Date().getTime() / 1000))
  // const expired = {}
  const publicKey = [{
    id: `${did}#owner`,
    type: 'Secp256k1VerificationKey2018',
    owner: did,
    ethereumAddress: owner,
  }, ]

  const authentication = [{
    type: 'Secp256k1SignatureAuthentication2018',
    publicKey: `${did}#owner`,
  }, ]

  let delegateCount = 0
  const auth = {}
  const pks = {}
  const services = {}
  for (let event of history) {
    let validTo = event.validTo
    const key = `${event._eventName}-${event.delegateType ||
      event.name}-${event.delegate || event.value}`
    if (validTo && validTo.gte(now)) {
      if (event._eventName === 'DIDDelegateChanged') {
        delegateCount++
        const delegateType = bytes32toString(event.delegateType)
        switch (delegateType) {
          case 'sigAuth':
            auth[key] = {
              type: 'Secp256k1SignatureAuthentication2018',
              publicKey: `${did}#delegate-${delegateCount}`,
            }
          case 'veriKey':
            pks[key] = {
              id: `${did}#delegate-${delegateCount}`,
              type: 'Secp256k1VerificationKey2018',
              owner: did,
              ethereumAddress: event.delegate,
            }
            break
        }
      } else if (event._eventName === 'DIDAttributeChanged') {
        const name = bytes32toString(event.name)
        const match = name.match(
          /^did\/(pub|auth|svc)\/(\w+)(\/(\w+))?(\/(\w+))?$/
        )
        if (match) {
          const section = match[1]
          const algo = match[2]
          const type = attrTypes[match[4]] || match[4]
          const encoding = match[6]
          switch (section) {
            case 'pub':
              delegateCount++
              const pk = {
                id: `${did}#delegate-${delegateCount}`,
                type: `${algo}${type}`,
                owner: did,
              }
              switch (encoding) {
                case null:
                case undefined:
                case 'hex':
                  pk.publicKeyHex = event.value.slice(2)
                  break
                case 'base64':
                  pk.publicKeyBase64 = Buffer.from(
                    event.value.slice(2),
                    'hex'
                  ).toString('base64')
                  break
                case 'base58':
                  pk.publicKeyBase58 = Buffer.from(
                    event.value.slice(2),
                    'hex'
                  ).toString('base58')
                  break
                case 'pem':
                  pk.publicKeyPem = Buffer.from(
                    event.value.slice(2),
                    'hex'
                  ).toString()
                  break
                default:
                  pk.value = event.value
              }
              pks[key] = pk
              break
            case 'svc':
              services[key] = {
                type: algo,
                serviceEndpoint: Buffer.from(
                  event.value.slice(2),
                  'hex'
                ).toString(),
              }
              break
          }
        }
      }
    } else {
      if (
        delegateCount > 0 &&
        (event._eventName === 'DIDDelegateChanged' ||
          (event._eventName === 'DIDAttributeChanged' &&
            bytes32toString(event.name).match(/^did\/pub\//))) &&
        validTo.lt(now)
      )
        delegateCount--
      delete auth[key]
      delete pks[key]
      delete services[key]
    }
  }

  const doc = {
    '@context': 'https://w3id.org/did/v1',
    id: did,
    publicKey: publicKey.concat(Object.values(pks)),
    authentication: authentication.concat(Object.values(auth)),
  }
  if (Object.values(services).length > 0) {
    doc.service = Object.values(services)
  }

  return doc
}

export function lookUpDDO(identity) {
  const publicKey = [{
    id: `${did}#owner`,
    type: 'Secp256k1VerificationKey2018',
    owner: did,
    ethereumAddress: owner,
  }, ]

  const authentication = [{
    type: 'Secp256k1SignatureAuthentication2018',
    publicKey: `${did}#owner`,
  }, ]

  return {
    '@context': 'https://w3id.org/did/v1',
    id: 'did:pistis:' + identity,
    publicKey: [{
      id: 'didpistis:' + identity + '#owner',
      type: 'Secp256k1VerificationKey2018',
      owner: 'did:pistis:' + identity,
      ethereumAddress: identity
    }],
    authentication: [{
      type: 'Secp256k1SignatureAuthentication2018',
      publicKey: 'did:pistis:' + identity + '#owner'
    }]
  }
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

  async function resolve(did, parsed) {
    parseDID(did)

    // const owner = await didReg.identityOwner(parsed.id)
    // const history = await changeLog(parsed.id)
    // return wrapDidDocument(did, owner['0'], history)
    return lookUpDDO(parsed.id)
  }

  registerMethod('pistis', resolve)
}

// module.exports = register
