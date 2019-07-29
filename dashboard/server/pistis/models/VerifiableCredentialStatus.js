'use-strict'
const statusRegistry = require('../contracts/credentialStatusRegistry')
const VerifiableCredential = require('./VerifiableCredential.js')

class VerifiableCredentialStatus {
  //takes a VerifiableCredential object as param
  constructor(vc) {
    if (!vc instanceof VerifiableCredential){
      throw "vc needs to be a VerifiableCredential object"
    }
    this.vc = vc
    this.status = {}
    console.log(this.vc) 
  }

  checkExpiry() {
    if (this.vc.exp < (new Date().getTime())) {
      this.status.exp = true
    } else {
      this.status.exp = false
    }
  }

  checkSenderSubMatch(sender) {
    if (this.vc.sub == sender) {
      this.status.sender = true
    } else {
      this.status.sender = false
    }
  }

  async checkRevocationStatus(){
    this.status.csl = await statusRegistry.getCredentialStatus(this.vc.iss, this.vc.csl.id)
  }

  getStatus(){
    return this.status
  }

}

module.exports = VerifiableCredentialStatus;
