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

const htmlTemplate = (qrImageUri, mobileUrl) => `<h1>PoliMi - Please Login</h1><div><img src="${qrImageUri}" /></div><div><a href="${mobileUrl}">Click here if on mobile</a> Or with username and password: TODO</div>`

const htmlTemplate2 = (user) => `<h1>Welcome ${user.studentNumber}</h1><div>Here you can request a Uni certificate</div>`


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
  did: 'did:ethr:0xbc3ae59bc76f894822622cdef7a2018dbe353840',
  privateKey: '74894f8853f90e6e3d6dfdd343eb0eb70cca06e552ed8af80adadcc573b35da3'
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
    notifications: false,
    callbackUrl: endpoint + '/login/' + randomString
  }).then(requestToken => {
      const uri = message.paramsToQueryString(message.messageToURI(requestToken), {callback_type: 'post'})
      const qr =  transports.ui.getImageDataURI(uri)
      res.render('home', {qr: qr, uri: uri, ngrok: endpoint})
  })
})

io.on('connection', function(socket){
  console.log('a user connected: ' + randomString);
  app.post('/login/' + randomString, (req, res) => {
      const jwt = req.body.access_token
      if (jwt != null) {
        console.log('someone logged in...')
        credentials.authenticateDisclosureResponse(jwt).then(creds => {
          const did = creds.did
          const pushToken = creds.pushToken
          const pubEncKey = creds.boxPub
          const user = utils.lookUpDIDPerson(did)
          if (user != null) {
            utils.logUserIn(socket.id, user)
          }
          socket.emit('loginAction', user)
        })
        //else use username and password
      } else {
        //TODO
      }
  })

  socket.on('requestVC', function(){
    let whoIs = utils.getUserFromSocket(socket.id)
    console.log('user ' + whoIs.studentNumber + ' has requested a VC')
    credentials.createVerification({
      sub: whoIs.did,
      exp: Time30Days(),
      claim: {'UniversityDegree' : {'Name' : 'Computer Engineering'}}
    }).then(att => {
      const uri = message.paramsToQueryString(message.messageToURI(att), {callback_type: 'post'})
      const qr =  transports.ui.getImageDataURI(uri)
      messageLogger(att, 'Encoded Attestation Sent to User (Signed JWT)')
      messageLogger(decodeJWT(att), 'Decoded Attestation Payload of Above')
      socket.emit('qrSent', qr) //TODO should also send uri
    })
  });
});

http.listen(8088, () => {
  console.log('ready!!!')
  ngrok.connect(8088).then(ngrokUrl => {
    endpoint = ngrokUrl
    console.log(`Attestation Creator Service running, open at ${endpoint}`)
    opn(endpoint, {app: 'chrome'})
  });
})
