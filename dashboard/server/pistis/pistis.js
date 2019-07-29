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
const VerifiableCredential = require('./models/VerifiableCredential.js')
const VerifiableCredentialStatus = require('./models/VerifiableCredentialStatus.js')
import resolve from 'did-resolver'
import {
  constants
} from 'buffer';
const multiSigOperations = require('./contracts/multiSigOperations.js')
const EventEmitter = require('events');

class Pistis extends EventEmitter {
  constructor(address, privateKey, did) {
    super()
    this.address = address;
    this.privateKey = privateKey;
    this.did = did;
    this.signer = new SimpleSigner(privateKey)
    registerResolver.default(
      //   {
      //   rpcUrl: 'ws://172.31.51.161:7545'
      // }
    )
  }

  async refreshEvents() {
    let events = await multiSigOperations.watchEvents(addr)
    console.log('refresh: ---> ' + multiSigOperations.latestBlockChecked)
    console.log(events)
    if (events.pendingOperationsChanged) {
      this.emit('pendingOperationsChanged')
    }
    if (events.didDocChanged) {
      this.emit('didDocChanged')
    }
  }

  init() {
    const addr = this.address
    const self = this
    setInterval(async () => {
      let events = await multiSigOperations.watchEvents(this.address)
      console.log('refresh: ---> ' + multiSigOperations.latestBlockChecked)
      console.log(events)
      if (events.pendingOperationsChanged) {
        self.emit('pendingOperationsChanged')
      }
      if (events.didDocChanged) {
        self.emit('didDocChanged')
      }
    }, 3000)
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
        files[i].push(vc.files[j])
      }

      //push data
      data.push([])
      console.log(data)
      for (var k = 0; k < vc.data.length; k++) {
        data[i].push(vc.data[k])
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
        let vc = new VerifiableCredential(vcObj.payload)
        //check files

        //check data
        vc.checkData(obj.payload.data[i])

        verified_credentials.push(vc)
      } catch (err) {
        console.log(err)
      }
    }
    return verified_credentials
  }

  //check VC status and returns a verifiableCredentialStatus status object
  async checkVCStatus(vc) {
    let vcStatus = new VerifiableCredentialStatus(vc)
    vcStatus.checkExpiry()
    await vcStatus.checkRevocationStatus()
    return vcStatus.getStatus()
  }

  async provaVerifyJWT() {
    let vcprova = {
      sub: 'did:ethr:0xa0edad57408c00702a3f20476f687f3bf8b61ccf',
      exp: 1682840792,
      csu: {
        "@context": "https://schema.org",
        "@type": "DiagnosticProcedure",
        "name": "Mbareeeeeee",
        "bodyLocation": "<?f0?>",
        "outcome": {
          "@type": "MedicalEntity",
          "code": {
            "@type": "MedicalCode",
            "codeValue": "0123",
            "codingSystem": "ICD-10"
          },
          "legalStatus": {
            "@type": "MedicalImagingTechnique",
            "image": "..."
          }
        }
      }
    }
  }

  async resolveDIDDocument(identity) {
    return resolve(identity || this.did)
  }

  async fetchPendingOperations() {
    const operations = await multiSigOperations.fetchPendingOperations(this.address)
    return operations
  }


  watchOperationsEvents() {
    console.log('reset watcher...')
    multiSigOperations.setLatestBlock(0)
  }

  async authenticateAndCheckVP(vp) {
    //TODO
  }

  createVerifiableCredentialStatus(vc) {
    return new VerifiableCredentialStatus(vc)
  }

}


module.exports = Pistis;