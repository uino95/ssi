'use-strict'
import {
  Credentials
} from 'uport-credentials'
const transports = require('uport-transports').transport
const message = require('uport-transports').message.util
const {
  createJWT,
  verifyJWT,
  decodeJWT,
  SimpleSigner
} = require('did-jwt')
const helper = require('./helper.js')

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
        resolve(token)
      })
    })
  }

  //returns the base64 token of the Verifiable Presentation
  //vcl = list of VerifiableCredentials
  async createAttestationVP(verifiableCredentialList) {
    //handle large files
    let vcl = []
    let files = []
    for (var i = 0; i < verifiableCredentialList.length; i++) {
      let vc = verifiableCredentialList[i]
      let toPush = await this.createVCToken(vc)
      vcl.push(toPush)
      for (var i = 0; i < vc.files.length; i++) {
        files.push(vc.files[i])
      }
    }

    //create VP
    const payload = {
      type: "attestation",
      vcl: vcl,
      files: files
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

// function createVC(payload) {
//   return new Promise((resolve, reject) => {
//     credentials.createVerification(payload).then(vc => {
//       resolve(vc)
//     })
//   })
// }
//
// function createDisclosureRequest(callbackUrl, requested) {
//   return new Promise((resolve, reject) => {
//     credentials.createDisclosureRequest({
//       requested: requested,
//       notifications: false,
//       callbackUrl: callbackUrl
//     }).then(requestToken => {
//       resolve(generateQRFromToken(requestToken))
//     })
//   })
// }
//
//
// function generateQRFromToken(token) {
//   var uri = message.paramsToQueryString(message.messageToURI(token), {
//     callback_type: 'post'
//   })
//   //TODO remove uport from URL
//   const qr = transports.ui.getImageDataURI(uri)
//   uri = helper.concatDeepUri(uri)
//   return {
//     qr: qr,
//     uri: uri,
//     requestToken: token
//   }
// }
//
//
// module.exports = {
//   authenticateDisclosureResponse: function(jwt) {
//     return new Promise((resolve, reject) => {
//       credentials.authenticateDisclosureResponse(jwt).then(obj => {
//         resolve(obj)
//       })
//     })
//   },
//   createDisclosureRequest: function(callbackUrl, vcs) {
//     return new Promise((resolve, reject) => {
//       createDisclosureRequest(callbackUrl, vcs).then(obj => {
//         resolve(obj)
//       })
//     })
//   },
//   createVP: function(vcs) {
//     return new Promise((resolve, reject) => {
//       var vcsArr = [];
//       var promises = vcs.map(function(vc) {
//         createVC(vc).then(obj => {
//           vcsArr.push(obj)
//         })
//       })
//       Promise.all(promises).then(function(results) {
//         console.log(results)
//       })
//       credentials.createVerification({
//         type: 'VerifiablePresentation',
//         verifiableCredential: vcsArr //list of VCs
//       }).then(token => {
//         helper.messageLogger(token, 'VP Sent to User')
//         resolve(generateQRFromToken(token))
//       })
//     })
//   },
//   createVerification: function(vcs) {
//     return new Promise((resolve, reject) => {
//       createVC(vcs).then(token => {
//         helper.messageLogger(token, 'VC Sent to User')
//         resolve(generateQRFromToken(token))
//       })
//     })
//   },
//   decodeJWT: function(jwt) {
//     return decodeJWT(jwt);
//   }
//
// }

module.exports = Pistis;
