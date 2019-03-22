const lodash = require('lodash')
var loggedUsers = []

module.exports = {
    isTrustedIssuer:function(did) {
        //here the Trusted Contacts Manager is invoked
        if (did == 'did:ethr:0xbc3ae59bc76f894822622cdef7a2018dbe353840') {
          return true
        }
        return false
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
