const lodash = require('lodash')
const request = require("request");
var loggedUsers = []

module.exports = {
    isTrustedIssuer:function(did, callback, socket) {
      console.log('[TCM]: updating <Entity, DID> list...')
      request.get('https://us-central1-miur-tcm-tglndr.cloudfunctions.net/getList', (error, response, body) => {
        let data = Object.values(JSON.parse(body));
        console.log(data)
        for (var i = 0, len = data.length; i < len; i++) {
          console.log(data[i].did)
          if (did == data[i].did) {
            callback(socket, data[i].name)
            return
          }
        }
        callback(socket, null)
      });
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
