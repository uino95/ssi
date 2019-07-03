'use-strict'
const statusRegistry = require('../contracts/statusRegistry')

class VerifiableCredentialStatus {
  //takes a VerifiableCredential object as param
  constructor(vc) {
    this.vc = vc
  }

  checkExpiry() {
    if (this.vc.exp < (new Date().getTime())) {
      this.expired = true
    } else {
      this.expired = false
    }
  }

  checkSenderSubMatch(sender) {
    if (this.vc.sub == sender) {
      this.senderSubMatch = true
    } else {
      this.senderSubMatch = false
    }
  }

  async checkStatus(){
    this.credStatus = await statusRegistry.getCredentialStatus(this.vc.iss, this.vc.csl.id)
  }

  
}

module.exports = VerifiableCredentialStatus;
