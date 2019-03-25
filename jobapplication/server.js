var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const ngrok = require('ngrok')
const bodyParser = require('body-parser')

var ejs = require('ejs')

var opn = require('opn');

// const uport = require('../lib/index.js')
import { Credentials } from 'uport-credentials'
const utils = require('./utils.js')
var io = require('socket.io')(http);

const decodeJWT = require('did-jwt').decodeJWT
const transports = require('uport-transports').transport
const message = require('uport-transports').message.util

console.log('loading server...')

const Time30Days = () => Math.floor(new Date().getTime() / 1000) + 1 * 24 * 60 * 60
let endpoint = ''

const messageLogger = (message, title) => {
  const wrapTitle = title ? ` \n ${title} \n ${'-'.repeat(60)}` : ''
  const wrapMessage = `\n ${'-'.repeat(60)} ${wrapTitle} \n`
  console.log(wrapMessage)
  console.log(message)
}

app.use(bodyParser.json({ type: '*/*' }))

//Setting up EJS view Engine and where to get the views from
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

const credentials = new Credentials({
  did: 'did:ethr:0x9fe146cd95b4ff6aa039bf075c889e6e47f8bd18',
  privateKey: 'fb7b756934671214d49cef23ff8f7bc154c78b12d39d90fd4eb3b01c65cc6fa3'
})

/**
 *  First creates a disclosure request to get the DID (id) of a user. Also request push notification permission so
 *  a push can be sent as soon as a response from this request is received. The DID is used to create the attestation
 *  below. And a pushToken is used to push that attestation to a user.
 */
var randomString = 'aaaaaa'

app.get('/', (req, res) => {
  randomString = utils.generateRandomString(10)
  credentials.createDisclosureRequest({
    verified: ['UniversityDegree'],
    callbackUrl: endpoint + '/verifyDegree/' + randomString
  }).then(requestToken => {
      const uri = message.paramsToQueryString(message.messageToURI(requestToken), {callback_type: 'post'})
      const qr =  transports.ui.getImageDataURI(uri)
      res.render('home', {qr: qr, uri: uri, ngrok: endpoint})
  })
})

const emitEntityName = (socket, name) => {
  console.log('entityName is:' + name)
  socket.emit('verifiedDegree', name)
}

io.on('connection', function(socket){
  console.log('a user connected: ' + randomString);
  app.post('/verifyDegree/' + randomString, (req, res) => {
      const jwt = req.body.access_token
      if (jwt != null) {
        console.log('someone is applying...')
        credentials.authenticateDisclosureResponse(jwt).then(creds => {
          const vc = creds.verified[0] //TODO should access it by key
          messageLogger(vc, 'VC: creds.verified[0].claim')
          var entityName = null
          if (vc != null && vc.claim.UniversityDegree.Name == 'Computer Engineering') {
            let entityName = utils.isTrustedIssuer(vc.iss, emitEntityName, socket)
          }
        })
      }
  })
});


http.listen(8088, () => {
  console.log('ready!!!')
  ngrok.connect(8088).then(ngrokUrl => {
    endpoint = ngrokUrl
    console.log(`Attestation Creator Service running, open at ${endpoint}`)
    opn(endpoint, {app: 'chrome'})
  });
})
