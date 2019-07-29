var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const constants = require('./pistis/contracts/constants');
const ngrok = require('ngrok')
const bodyParser = require('body-parser')
const Pistis = require('./pistis/pistis.js')
var open = require('open');

console.log('loading server...')

const Time30Days = () => Math.floor(new Date().getTime() / 1000) + 1 * 24 * 60 * 60
let endpoint = ''

const messageLogger = (message, title) => {
  const wrapTitle = title ? ` \n ${title} \n ${'-'.repeat(60)}` : ''
  const wrapMessage = `\n ${'-'.repeat(60)} ${wrapTitle} \n`
  console.log(wrapMessage)
  console.log(message)
}

app.use(bodyParser.json({
  type: '*/*'
}))


let pistis = new Pistis('0x85FD638BD834Fa28FFa70bf29c6BF8585aE7d6a5', 'f5d0ead35c21a2b945be8577cd19e13080fe1cf1769012d9c76c4f7c09e68f92','did:pistis:0x85FD638BD834Fa28FFa70bf29c6BF8585aE7d6a5');
pistis.init()

var currentConnections = {};

// pistis.provaVerifyJWT()

app.get('/', (req, res) => {
  res.send('The backend is not serving any page.')
})
app.post('/authVP', (req, res) => {
  const vp = req.body.access_token
  const socketid = req.query['socketid']
  console.log('someone sent a vc')
  if (vp != null) {
    pistis.authenticateVP(vp).then(res => {
      messageLogger(res, 'Final Result of authenticateDisclosureResponse')
      currentConnections[socketid].socket.emit('authenticatedCredentials', res)
    })
  }
});

pistis.on('didDocChanged', function () {
  pistis.resolveDIDDocument().then(doc => {
    console.log("DID DOC", doc)
    io.emit('DIDDocument', doc)
  })
})
pistis.on('pendingOperationsChanged', function () {
  pistis.fetchPendingOperations().then(operations => {
    console.log("PENDING OPERATIONS", operations)
    io.emit('pendingOperations', operations)
  })
})

//Socket Events
io.on('connection', function (socket) {
  console.log('a user connected: ' + socket.id);
  currentConnections[socket.id] = {
    socket: socket
  };

  pistis.watchOperationsEvents()

  socket.emit('contractsAddress', {
    multiSigOperations: constants.multiSigOperations,
    pistisDIDRegistry: constants.pistisDIDRegistry,
    credentialStatusRegistry: constants.credentialStatusRegistry,
  })


  socket.on('vcreader_request', function (data) {
    pistis.createDisclosureRequest({
      requested: ["*"],
      callbackUrl: endpoint + '/authVP?socketid=' + socket.id
    }).then(token => {
      socket.emit('vcreader_reqQR', {
        uri: Pistis.tokenToUri(token, false),
        qr: Pistis.tokenToQr(token, false)
      })
    })
  })

  socket.on('vcDisplayer_checkVCStatus', async function (data) {
    console.log('vcDisplayer_checkVCStatus...')
    var status = null
    try {
      status = await pistis.checkVCStatus(data.vc)
    } catch (err) {
      console.log(err)
    }
    socket.emit('vcDisplayer_checkVCStatus_reply', status)
  })

  socket.on('disconnect', function () {
    console.log(socket.id + ' disconnected...')
    delete currentConnections[socket.id];
  })

});

const port = 8080
http.listen(port, () => {
  console.log('ready!!! at ' + port)
  // ngrok.connect(port).then(ngrokUrl => {
  //   endpoint = ngrokUrl
  //   console.log(`Server Service running, open at ${endpoint}`)
  //   // open(endpoint, {
  //   //   app: 'chrome'
  //   // })
  // });
})