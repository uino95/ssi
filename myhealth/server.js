var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const ngrok = require('ngrok')
const bodyParser = require('body-parser')

var ejs = require('ejs')

var open = require('open');

app.use(express.static(__dirname + 'views'));

// const uport = require('../lib/index.js')
import {
  Credentials
} from 'uport-credentials'
const utils = require('./utils.js')

const decodeJWT = require('did-jwt').decodeJWT
const transports = require('uport-transports').transport
const message = require('uport-transports').message.util

console.log('loading server...')

const Time30Days = () => Math.floor(new Date().getTime() / 1000) + 1 * 24 * 60 * 60
let endpoint = 'localhost'

const messageLogger = (message, title) => {
  const wrapTitle = title ? ` \n ${title} \n ${'-'.repeat(60)}` : ''
  const wrapMessage = `\n ${'-'.repeat(60)} ${wrapTitle} \n`
  console.log(wrapMessage)
  console.log(message)
}

app.use(bodyParser.json({
  type: '*/*'
}))

//Setting up EJS view Engine and where to get the views from
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('views'))

const credentials = new Credentials({
  did: 'did:ethr:0xbc3ae59bc76f894822622cdef7a2018dbe353840',
  privateKey: '74894f8853f90e6e3d6dfdd343eb0eb70cca06e552ed8af80adadcc573b35da3'
})

/**
 *  First creates a disclosure request to get the DID (id) of a user. Also request push notification permission so
 *  a push can be sent as soon as a response from this request is received. The DID is used to create the attestation
 *  below. And a pushToken is used to push that attestation to a user.
 */

var currentConnections = {};

app.get('/', (req, res) => {
  res.render('home', {})
})

app.post('/login', (req, res) => {
      const jwt = req.body.access_token
      const socketid = req.query['socketid']
      console.log('someone logged in...')
      if (jwt != null) {
        credentials.authenticateDisclosureResponse(jwt).then(creds => {
          messageLogger(decodeJWT(jwt), 'Shared VC from a User')
          const did = creds.did
          currentConnections[socketid].did = did
          currentConnections[socketid].socket.emit('loggedIn', did)
        })
      }
});


//Socket Events
io.on('connection', function(socket) {
  console.log('a user connected: ' + socket.id);
  currentConnections[socket.id] = {
    socket: socket
  };

  credentials.createDisclosureRequest({
    requested: ["name"],
    notifications: false,
    callbackUrl: endpoint + '/login?socketid=' + socket.id
  }).then(requestToken => {
      var uri = message.paramsToQueryString(message.messageToURI(requestToken), {callback_type: 'post'})
      // uri = utils.concatDeepUri(uri)
      const qr =  transports.ui.getImageDataURI(uri)
      messageLogger(requestToken, "Request Token")
      socket.emit('qrLogin', {qr: qr, uri: uri})
  })

  socket.on('bookScan', function(booking) {
    console.log(currentConnections[socket.id].did + ' ' + booking)
    //31/05/2019 14:00
    let times = booking.split('/')
    let day = Number(booking.slice(0, 2))
    let month = Number(booking.slice(3, 5))
    let year = Number(booking.slice(6, 10))
    let minutes = Number(booking.slice(11, 13)) + 5  //5 more mins
    let hours = Number(booking.slice(14, 16))
    let exp = new Date(year, month, day, hours, minutes)
    console.log(exp)
    credentials.createVerification({
      sub: currentConnections[socket.id].did,
      exp: exp.getTime(),
      claim: [{
        'Scan': {
          'TimeSlot': booking
        }
      }]
    }).then(att => {
      var uri = message.paramsToQueryString(message.messageToURI(att), {
        callback_type: 'post'
      })
      // uri = utils.concatDeepUri(uri)
      const qr = transports.ui.getImageDataURI(uri)
      messageLogger(att, 'Encoded VC Sent to User (Signed JWT)')
      messageLogger(decodeJWT(att), 'Decoded VC Payload of Above')
      currentConnections[socket.id].socket.emit('bookScanVC', {qr:qr, uri:uri})
    })
  })

  socket.on('disconnect', function() {
    console.log(socket.id + ' disconnected...')
    delete currentConnections[socket.id];
  })
});



http.listen(8088, () => {
  console.log('ready!!!')
  ngrok.connect(8088).then(ngrokUrl => {
    endpoint = ngrokUrl
    console.log(`Polimi Service running, open at ${endpoint}`)
    open(endpoint, {
      app: 'chrome'
    })
  });
  // opn('localhost:3000', {app: 'chrome'})
})
