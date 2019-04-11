const lodash = require('lodash')
var loggedUsers = []

module.exports = {
    lookUpDIDPerson:function(did) {
        if (did == 'did:ethr:0x406d5f8752ff15d9ab6016c5b7e193651920e6f0') {
          return {name: 'andrea', surname: 'taglia', studentNumber: '898733', did: did}
        }else if (did == 'did:ethr:0xa0edad57408c00702a3f20476f687f3bf8b61ccf') {
          return {name: 'matteo', surname: 'sinico', studentNumber: '898733', did: did}
        }
        return null
    },
    lookUpUserPass:function(user, pass){
      if (user == '898733' && pass == 'password') {
        return {name: 'andrea', surname: 'taglia', studentNumber: '898733'}
      }
      return null
    },
    generateRandomString:function(length) {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    },
    logUserIn:function(socketId, user){
      loggedUsers.push({socketId:socketId, user:user})
    },
    getUserFromSocket:function(socketId){
      let res = lodash.find(loggedUsers, function(o) { return o.socketId == socketId; })
      return (res.user || null)
    }

}
