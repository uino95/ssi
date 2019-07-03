'use-strict'
const helper = require('./helper.js')
const sha256 = require('js-sha256')
var request = require('request').defaults({
  encoding: null
});

class VerifiableCredential {
  constructor(vc) {
    this.sub = vc.subjectDID,
      this.exp = vc.expiry ? vc.expiry : helper.Time30Days(),
      this.csu = vc.credentialSubject,
      this.files = []
  }

  async addLargeFile(fileLoc) {
    let fileId = this.files.length
    console.log(fileId)
    const fileContent = await VerifiableCredential.fetchFile(fileLoc)
    let claim = JSON.stringify(this.csu)
    let hash = sha256(fileContent)
    claim = claim.replace('<?f' + fileId + '?>', '<?f' + fileId + '?>' + hash)
    this.csu = JSON.parse(claim)
    this.files.push(fileLoc)
    return
  }

  static async fetchFile(fileLoc) {
    return new Promise((resolve, reject) => {
      if (fileLoc.location == 'remote') {
        request.get(fileLoc.content, function(error, response, body) {
          if (!error && response.statusCode == 200) {
            let content = response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
            resolve(content)
          }
        });
      } else {
        throw 'unsupported file location type'
      }
    })
  }

}

module.exports = VerifiableCredential;
