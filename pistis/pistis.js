'use-strict'
const transports = require('uport-transports').transport
const message = require('uport-transports').message.util
const {
  createJWT,
  verifyJWT,
  decodeJWT,
  SimpleSigner
} = require('did-jwt')
const helper = require('./helper.js')

// const base64url = require('base64url')
// const Web3 = require('web3')
// var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

class Pistis {
  constructor(address, privateKey) {
    this.address = address;
    this.privateKey = privateKey;
    this.did = 'did:ethr:' + address;
    this.signer = new SimpleSigner(privateKey)
  }

  // returns the base64 token of the Verifiable Credential
  createVCToken(vc) {
    const payload = {
      sub: vc.sub,
      exp: vc.exp,
      csu: vc.csu
    }
    return new Promise((resolve, reject) => {
      createJWT(payload, {
        issuer: this.did,
        signer: this.signer,
        alg: "ES256K-R"
      }).then(token => {
        // let res = base64url.decode(token)
        // console.log('---------------------------')
        // let signature = res//.slice(2)
        // console.log(signature)
        // let r = `0x${signature.slice(0, 64)}`
        // console.log('r:' + r)
        // let s = `0x${signature.slice(64, 128)}`
        // console.log('s:' + s)
        // let v = web3.utils.toDecimal(signature.slice(128, 130)) + 27
        // console.log('v:' + v)
        // console.log('hash:' + web3.utils.soliditySha3('\x19Ethereum Signed Message:\n32', msg))
        // console.log('---------------------------')
        resolve(token)
      })
    })
  }

  //returns the base64 token of the Verifiable Presentation
  async createAttestationVP(verifiableCredentialList) {
    //handle large files
    let vcl = []
    let files = []
    let data = []
    for (var i = 0; i < verifiableCredentialList.length; i++) {
      let vc = verifiableCredentialList[i]
      let toPush = await this.createVCToken(vc)
      vcl.push(toPush)

      //push files
      files.push([])
      for (var i = 0; i < vc.files.length; i++) {
        files[i].push(vc.files[i])
      }

      //push data
      data.push([])
      //TODO
    }

    //create VP
    const payload = {
      type: "attestation",
      vcl: vcl,
      files: files,
      data: data
    }
    return new Promise((resolve, reject) => {
      createJWT(payload, {
        issuer: this.did,
        signer: this.signer,
        alg: "ES256K-R"
      }).then(token => {
        resolve(token)
      })
    })
  }

  async createDisclosureRequest(req) {
    const payload = {
      type: "shareReq",
      callback: req.callbackUrl,
      requested: req.requested,
      exp: new Date().getTime() + (300 * 1000) //expires in one minute
    }
    return new Promise((resolve, reject) => {
      createJWT(payload, {
        issuer: this.did,
        signer: this.signer,
        alg: "ES256K-R"
      }).then(token => {
        resolve(token)
      })
    })
  }

  static tokenToQr(token, addPostCallback) {
    return transports.ui.getImageDataURI(Pistis.tokenToUri(token, addPostCallback))
  }

  static tokenToUri(token, addPostCallback) {
    return message.paramsToQueryString(message.messageToURI(token), (addPostCallback ? {
      callback_type: 'post'
    } : {}))
  }

}


module.exports = Pistis;
