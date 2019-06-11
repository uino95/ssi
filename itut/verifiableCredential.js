'use-strict'
const helper = require('./helper.js')
const rp = require('request-promise')
const sha256 = require('js-sha256')

class VerifiableCredential {
  constructor(vc) {
    this.sub = vc.subjectDID,
      this.exp = vc.expiry ? vc.expiry : helper.Time30Days(),
      this.csu = vc.credentialSubject,
      this.files = []
  }

  async addLargeFile(fileLoc) {
    return new Promise((resolve, reject) => {
      let fileId = this.files.length
      console.log(fileId)
      VerifiableCredential.fetchFile(fileLoc).then(fileContent => {
        let claim = JSON.stringify(this.csu)
        let hash = sha256(fileContent)
        claim = claim.replace('<?f' + fileId + '?>', '<?f' + fileId + '?>' + hash)
        this.csu = JSON.parse(claim)
        this.files.push(fileLoc)
        resolve()
      })
    })
  }

  static async fetchFile(fileLoc) {
    return new Promise((resolve, reject) => {
      if (fileLoc.location == 'remote') {
        rp(fileLoc.url)
          .then(function(htmlString) {
            resolve(htmlString)
          })
          .catch(function(err) {
            console.log(err)
          });
      } else {
        throw 'unsupported file location type'
      }
    })
  }
}

module.exports = VerifiableCredential;
