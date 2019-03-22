const lodash = require('lodash')
var loggedUsers = []

module.exports = {
    lookUpDIDPerson:function(did) {
        if (did == 'did:ethr:0xba8fc4b85f779176dd0307ba8bce11e33843ed7d') {
          return {name: 'andrea', surname: 'taglia', studentNumber: '898733', did: did}
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
