'use-strict'
const helper = require('../helper.js')
const sha256 = require('js-sha256')
var request = require('request').defaults({
  encoding: null
});

class VerifiableCredential {
  constructor(vc) {
    try {
      this.sub = vc.sub,
        this.exp = vc.exp ? vc.exp : helper.Time30Days(),
        this.csu = vc.csu,
        this.files = [],
        this.data = []
    } catch (err) {
      throw "error in instanciating the VC: " + err
    }
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

  addData(data){
    let dataId = this.data.length
    let claim = JSON.stringify(this.csu)
    let hash = sha256(data)
    claim = claim.replace('<?d' + dataId + '?>', '<?d' + dataId + '?>' + hash )
    this.csu = JSON.parse(claim)
    this.data.push(data)
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
