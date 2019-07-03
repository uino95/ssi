const did_jwt = require('did-jwt')

module.exports = {
  concatDeepUri: function(uri) {
    return 'exp://192.168.1.7:19004/?req='.concat(uri)
  },
  messageLogger: function(message, title) {
    const wrapTitle = title ? ` \n ${title} \n ${'-'.repeat(60)}` : ''
    const wrapMessage = `\n ${'-'.repeat(60)} ${wrapTitle} \n`
    console.log(wrapMessage)
    console.log(message)
  },
  Time30Days: function() {
    return Math.floor(new Date().getTime() / 1000) + 1 * 24 * 60 * 60
  }
}
