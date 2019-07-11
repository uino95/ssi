'use-strict'
const transports = require('uport-transports').transport
const message = require('uport-transports').message.util
const {
  createJWT,
  verifyJWT,
  decodeJWT,
  SimpleSigner
} = require('did-jwt')
const registerResolver = require('./pistis-did-resolver/src/register.js')
const helper = require('./helper.js')
const VerifiableCredential = require('./models/VerifiableCredential.js')
const TrustedContactsList = require('./models/TrustedContactsList.js')
const VerifiableCredentialStatus = require('./models/VerifiableCredentialStatus.js')

class Pistis {
  constructor(address, privateKey) {
    this.address = address;
    this.privateKey = privateKey;
    this.did = 'did:pistis:' + address;
    this.signer = new SimpleSigner(privateKey)
    registerResolver.default({
      rpcUrl: 'http://127.0.0.1:7545'
    })
  }

  // returns the base64 token of the Verifiable Credential
  async createVCToken(vc) {
    const payload = {
      sub: vc.sub,
      exp: vc.exp,
      csu: vc.csu
    }
    //TODO change issuer after trials
    const token = await createJWT(payload, {
      issuer: 'did:pistis:0x5e2397Babcb4307ba6DA8B1A602635dCAF8eBAA7',
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
      for (var k = 0; k < vc.data.length; k++) {
        data[k].push(vc.data[k])
      }
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

  createVerifiableCredential(_vc, files, data) {
    let vc = new VerifiableCredential(_vc)

    for (var i = 0; i < files.length; i++) {
      vc.addLargeFile(files[i])
    }
    for (var i = 0; i < data.length; i++) {
      vc.addData(data[i])
    }

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
  //returns the decoded credentials payload of those who passed verification
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

        //check files

        //check data
        // for (var j = 0; j < vp.data[i].length; j++) {
        //   vp.data[i][j]
        // }

        verified_credentials.push(vcObj.payload)
      } catch (err) {
        console.log(err)
      }
    }
    return verified_credentials
  }

  //check VC status and returns a verifiableCredentialStatus status object
  async checkVCStatus(vc, tcl) {
    tcl = new TrustedContactsList(tcl)
    let vcStatus = new VerifiableCredentialStatus(vc, tcl)
    vcStatus.checkExpiry()
    await vcStatus.checkSubjectEntity()
    await vcStatus.checkIssuerEntity()
    await vcStatus.checkRevocationStatus()
    return vcStatus.getStatus()
  }

  async authenticateAndCheckVP(vp) {

  }

  async provaVerifyJWT(vc) {
    let options = {
      auth: true
    }
    let r = await verifyJWT(vc, options)
    return r
  }

  createVerifiableCredentialStatus(vc) {
    return new VerifiableCredentialStatus(vc)
  }

}


module.exports = Pistis;