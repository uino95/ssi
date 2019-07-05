'use-strict'

class TrustedContactsList {
  //takes a VerifiableCredential object as param
  constructor(tcl) {
    if ('@context' in tcl && tcl['@context'] == 'pistis-tcl/v1') {
      this.tcl = tcl
    } else {
      throw 'tcl version not recognized'
    }
  }

  async resolveEntity(did) {
    let arr = this.tcl['tcl']
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].src != 'this') {
        //// TODO: go look at the remote source
      } else {
        if (arr[i].did == did) {
          return arr[i].ent
        }
      }
    }
    return null
  }

}

module.exports = TrustedContactsList;
