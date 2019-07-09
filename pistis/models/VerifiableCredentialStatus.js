'use-strict'
const statusRegistry = require('../contracts/statusRegistry')
const VerifiableCredential = require('./VerifiableCredential.js')

class VerifiableCredentialStatus {
  //takes a VerifiableCredential object as param
  constructor(vc, tcl) {
    if (!vc instanceof VerifiableCredential){
      throw "vc needs to be a VerifiableCredential object"
    }
    if (!tcl instanceof TrustedContactsList) {
      throw "tcl needs to be a TrustedContactsList"
    }
    this.vc = vc
    this.tcl = tcl
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

  async checkSubjectEntity(){
    this.status.sub = await tcl.resolveEntity(this.vc.iss)
  }

  //check if issuer is in TCL
  async checkIssuerEntity(){
    this.status.ent = await tcl.resolveEntity(this.vc.iss)
  }

  async checkRevocationStatus(){
    this.status.csl = await statusRegistry.getCredentialStatus(this.vc.iss, this.vc.csl.id)
  }

  getStatus(){
    return this.status
  }

}

module.exports = VerifiableCredentialStatus;
