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

  checkData(data) {
    console.log(data)
    var claim = JSON.stringify(this.csu)
    var position
    var hash
    var hashedContent
    var content
    var filesToAdd = []
    console.log(claim)
    for (var i = 0; i < data.length; i++) {
      let start = claim.search("<\\?d") + 3;
      let end = claim.search("\\?>");
      position = parseInt(claim.substr(start, end - start));
      hash = claim.substr(end + 2, 64)
      console.log(hash)

      // TODO verify the hash content downloading it
      hashedContent = sha256(data[position])
      console.log(hashedContent)
      let substitution
      try {
        substitution = JSON.parse(data[position])
      } catch (err) {
        substitution = data[position]
      }
      if(hashedContent === hash){
        claim = claim.substring(0, start - 3) + substitution + claim.substring(end + 2 + 64);
      } else {
        throw new Error("data content doesn't match the hash in the credential" + claim.name)
      }
    }
    console.log(claim)

    this.csu = JSON.parse(claim)
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
