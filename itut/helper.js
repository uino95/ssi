const did_jwt = require('did-jwt')

module.exports = {
    concatDeepUri:function(uri){
      return 'itut-app://?req='.concat(uri)
    },
    messageLogger:function(message, title){
      const wrapTitle = title ? ` \n ${title} \n ${'-'.repeat(60)}` : ''
      const wrapMessage = `\n ${'-'.repeat(60)} ${wrapTitle} \n`
      console.log(wrapMessage)
      console.log(message)
    },
    decodeJWT:function(jwt){
      return did_jwt.decodeJWT(jwt)
    }
}
