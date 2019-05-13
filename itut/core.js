import {
  Credentials
} from 'uport-credentials'

const decodeJWT = require('did-jwt').decodeJWT
const transports = require('uport-transports').transport
const message = require('uport-transports').message.util

const helper = require('./helper.js')

var credentials;

function createVC(payload) {
  return new Promise((resolve, reject) => {
    credentials.createVerification(payload).then(vc => {
      resolve(vc)
    })
  })
}

function createDisclosureRequest(callbackUrl, requested) {
  return new Promise((resolve, reject) => {
    credentials.createDisclosureRequest({
      requested: requested,
      notifications: false,
      callbackUrl: callbackUrl
    }).then(requestToken => {
      resolve(generateQRFromToken(requestToken))
    })
  })
}


function generateQRFromToken(token) {
  var uri = message.paramsToQueryString(message.messageToURI(token), {
    callback_type: 'post'
  })
  //TODO remove uport from URL
  const qr = transports.ui.getImageDataURI(uri)
  uri = helper.concatDeepUri(uri)
  return {
    qr: qr,
    uri: uri,
    requestToken: token
  }
}


module.exports = {
  setUpCredentials: function(did, privateKey) {
    credentials = new Credentials({
      did: 'did:ethr:0xbc3ae59bc76f894822622cdef7a2018dbe353840',
      privateKey: '74894f8853f90e6e3d6dfdd343eb0eb70cca06e552ed8af80adadcc573b35da3'
    })
  },
  authenticateDisclosureResponse: function(jwt) {
    return new Promise((resolve, reject) => {
      credentials.authenticateDisclosureResponse(jwt).then(obj => {
        resolve(obj)
      })
    })
  },
  createDisclosureRequest: function(callbackUrl, vcs) {
    return new Promise((resolve, reject) => {
      createDisclosureRequest(callbackUrl, vcs).then(obj => {
        resolve(obj)
      })
    })
  },
  createVP: function(vcs) {
    return new Promise((resolve, reject) => {
      var vcsArr = [];
      var promises = vcs.map(function(vc) {
        createVC(vc).then(obj =>{
          vcsArr.push(obj)
        })
      })
      Promise.all(promises).then(function(results) {
        console.log(results)
      })
      credentials.createVerification({
        type: 'VerifiablePresentation',
        verifiableCredential: vcsArr //list of VCs
      }).then(token => {
        helper.messageLogger(token, 'VP Sent to User')
        resolve(generateQRFromToken(token))
      })
    })
  },
  createVerification: function(vcs) {
    return new Promise((resolve, reject) => {
      createVC(vcs).then(token => {
        helper.messageLogger(token, 'VC Sent to User')
        resolve(generateQRFromToken(token))
      })
    })
  },
  decodeJWT: function(jwt) {
    return decodeJWT(jwt);
  }

}
