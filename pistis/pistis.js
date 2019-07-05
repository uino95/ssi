'use-strict'
const transports = require('uport-transports').transport
const message = require('uport-transports').message.util
const {
  createJWT,
  verifyJWT,
  decodeJWT,
  SimpleSigner
} = require('did-jwt')
const registerResolver = require('ethr-did-resolver')
const helper = require('./helper.js')
const VerifiableCredential = require('./models/verifiableCredential.js')
const VerifiableCredentialStatus = require('./models/verifiableCredentialStatus.js')

class Pistis {
  constructor(address, privateKey) {
    this.address = address;
    this.privateKey = privateKey;
    this.did = 'did:ethr:' + address;
    this.signer = new SimpleSigner(privateKey)
    registerResolver.default({
      rpcUrl: 'https://ropsten.infura.io/v3/9b3e31b76db04cf2a6ff7ed0f1592ab9'
    })
  }

  // returns the base64 token of the Verifiable Credential
  async createVCToken(vc) {
    const payload = {
      sub: vc.sub,
      exp: vc.exp,
      csu: vc.csu
    }
    const token = await createJWT(payload, {
      issuer: this.did,
      signer: this.signer,
      alg: "ES256K-R"
    })
    return token
  }

  //returns the base64 token of the Verifiable Presentation
  async createAttestationVP(verifiableCredentialList) {
    //handle large files
    let vcl = []
    let files = []
    let data = []
    for (var i = 0; i < verifiableCredentialList.length; i++) {
      let vc = verifiableCredentialList[i]
      const toPush = await this.createVCToken(vc)
      vcl.push(toPush)

      //push files
      files.push([])
      for (var j = 0; j < vc.files.length; j++) {
        files[j].push(vc.files[j])
      }

      //push data
      data.push([])
      //TODO
    }

    console.log(vcl.length)
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

  createVerifiableCredential(_vc, files, data){
    let vc = new VerifiableCredential(_vc)
    
    for (var i = 0; i < files.length; i++) {
      vc.addLargeFile(files[i])
    }
    // TODO add data
    return vc
  }

  async createDisclosureRequest(req) {
    const payload = {
      type: "shareReq",
      callback: req.callbackUrl,
      requested: req.requested,
      exp: new Date().getTime() + (300 * 5000) //expires in five minutes
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

  //athenticate the verifiable presentation and the credentials it is carrying
  async authenticateVP(vp) {
    const obj = await verifyJWT(vp, {
      audience: this.did
    })
    let verified_credentials = []
    // let sender = obj.payload.iss
    //now verify each credential
    for (var i = 0; i < obj.payload.vcl.length; i++) {
      try {
        const vcObj = await verifyJWT(obj.payload.vcl[i])
        verified_credentials.push(vcObj.payload)
      } catch (err) {
        console.log(err)
      }
    }
    return verified_credentials
  }

  async authenticateAndCheckVP(vp){

  }

  createVerifiableCredentialStatus(vc){
    return new VerifiableCredentialStatus(vc)
  }

}


module.exports = Pistis;
