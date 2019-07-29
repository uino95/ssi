var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const ngrok = require('ngrok')
const bodyParser = require('body-parser')

const {
  isDevEnv,
  myhealth_port,
  callback_endpoint
} = require('../poc_config/config.js')

var ejs = require('ejs')

var open = require('open');

app.use(express.static(__dirname + 'views'));

// const uport = require('../lib/index.js')
import {
  Credentials
} from 'uport-credentials'
const helper = require('../itut/helper.js')

const decodeJWT = require('did-jwt').decodeJWT
const transports = require('uport-transports').transport
const message = require('uport-transports').message.util

console.log('loading server...')

const Time30Days = () => Math.floor(new Date().getTime() / 1000) + 1 * 24 * 60 * 60
const Time360Days = () => Math.floor(new Date().getTime() / 1000) + 1 * 24 * 60 * 60 * 12
let endpoint = callback_endpoint + ':' + myhealth_port

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
  did: 'did:ethr:0xeee6f3258a5c92e4a6153a27e251312fe95a19ae',
  privateKey: 'a1c2779e0e3476ac51183ff5d3f7b6045cc28d615ed21d15b7707c22e0f8174c'
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

app.get('/retrievevc', (req, res) => {
  let credentialSubject = {
    "@context": "https://schema.org",
    "@type": "DiagnosticProcedure",
    "name": "X-Ray Scan Result",
    "bodyLocation": "Leg",
    "outcome": {
      "@type": "MedicalEntity",
      "code": {
        "@type": "MedicalCode",
        "codeValue": "0123",
        "codingSystem": "ICD-10",
        "image": {
          "@type": "ImageObject",
          "contentUrl": "https://share.upmc.com/wp-content/uploads/2014/10/x-ray.png",
          "encoding": "CF0BF0055AF44C1DFAC9FB48080DE93F6C1F54A220127C7EC37CA9E8898DB00A",
          "encodingFormat": "SHA256"
        }
      }
    }
  }
  // let credentialSubject = {
  //   "@context": "https://schema.org",
  //   "@type": "DiagnosticProcedure",
  //   "name": "X-Ray Scan Result",
  //   "bodyLocation": "Leg",
  //   "outcome": {
  //     "@type": "MedicalEntity",
  //     "code": {
  //       "@type": "MedicalCode",
  //       "codeValue": "0123",
  //       "codingSystem": "ICD-10",
  //       "image": {
  //         "@type": "ImageObject",
  //         "contentUrl": "https://www.qldxray.com.au/wp-content/uploads/2018/03/imaging-provider-mobile.jpg",
  //         "encoding": "CF0BF0055AF44C1DFAC9FB48080DE93F6C1F54A220127C7EC37CA9E8898DB00A",
  //         "encodingFormat": "SHA256"
  //       },
  //       "image": {
  //         "@type": "ImageObject",
  //         "contentUrl": "https://www.qldxray.com.au/wp-content/uploads/2018/03/imaging-provider-mobile.jpg",
  //         "encoding": "CF0BF0055AF44C1DFAC9FB48080DE93F6C1F54A220127C7EC37CA9E8898DB00A",
  //         "encodingFormat": "SHA256"
  //       },
  //       "image": {
  //         "@type": "ImageObject",
  //         "contentUrl": "https://www.qldxray.com.au/wp-content/uploads/2018/03/imaging-provider-mobile.jpg",
  //         "encoding": "CF0BF0055AF44C1DFAC9FB48080DE93F6C1F54A220127C7EC37CA9E8898DB00A",
  //         "encodingFormat": "SHA256"
  //       },
  //       "image": {
  //         "@type": "ImageObject",
  //         "contentUrl": "https://www.qldxray.com.au/wp-content/uploads/2018/03/imaging-provider-mobile.jpg",
  //         "encoding": "CF0BF0055AF44C1DFAC9FB48080DE93F6C1F54A220127C7EC37CA9E8898DB00A",
  //         "encodingFormat": "SHA256"
  //       },
  //       "image": {
  //         "@type": "ImageObject",
  //         "contentUrl": "https://www.qldxray.com.au/wp-content/uploads/2018/03/imaging-provider-mobile.jpg",
  //         "encoding": "CF0BF0055AF44C1DFAC9FB48080DE93F6C1F54A220127C7EC37CA9E8898DB00A",
  //         "encodingFormat": "SHA256"
  //       },
  //       "image": {
  //         "@type": "ImageObject",
  //         "contentUrl": "https://www.qldxray.com.au/wp-content/uploads/2018/03/imaging-provider-mobile.jpg",
  //         "encoding": "CF0BF0055AF44C1DFAC9FB48080DE93F6C1F54A220127C7EC37CA9E8898DB00A",
  //         "encodingFormat": "SHA256"
  //       },
  //       "image": {
  //         "@type": "ImageObject",
  //         "contentUrl": "https://www.qldxray.com.au/wp-content/uploads/2018/03/imaging-provider-mobile.jpg",
  //         "encoding": "CF0BF0055AF44C1DFAC9FB48080DE93F6C1F54A220127C7EC37CA9E8898DB00A",
  //         "encodingFormat": "SHA256"
  //       },
  //       "image": {
  //         "@type": "ImageObject",
  //         "contentUrl": "https://www.qldxray.com.au/wp-content/uploads/2018/03/imaging-provider-mobile.jpg",
  //         "encoding": "CF0BF0055AF44C1DFAC9FB48080DE93F6C1F54A220127C7EC37CA9E8898DB00A",
  //         "encodingFormat": "SHA256"
  //       },
  //       "image": {
  //         "@type": "ImageObject",
  //         "contentUrl": "https://www.qldxray.com.au/wp-content/uploads/2018/03/imaging-provider-mobile.jpg",
  //         "encoding": "CF0BF0055AF44C1DFAC9FB48080DE93F6C1F54A220127C7EC37CA9E8898DB00A",
  //         "encodingFormat": "SHA256"
  //       },
  //       "image": {
  //         "@type": "ImageObject",
  //         "contentUrl": "https://www.qldxray.com.au/wp-content/uploads/2018/03/imaging-provider-mobile.jpg",
  //         "encoding": "CF0BF0055AF44C1DFAC9FB48080DE93F6C1F54A220127C7EC37CA9E8898DB00A",
  //         "encodingFormat": "SHA256"
  //       },
  //       "image": {
  //         "@type": "ImageObject",
  //         "contentUrl": "https://www.qldxray.com.au/wp-content/uploads/2018/03/imaging-provider-mobile.jpg",
  //         "encoding": "CF0BF0055AF44C1DFAC9FB48080DE93F6C1F54A220127C7EC37CA9E8898DB00A",
  //         "encodingFormat": "SHA256"
  //       },
  //       "image": {
  //         "@type": "ImageObject",
  //         "contentUrl": "https://www.qldxray.com.au/wp-content/uploads/2018/03/imaging-provider-mobile.jpg",
  //         "encoding": "CF0BF0055AF44C1DFAC9FB48080DE93F6C1F54A220127C7EC37CA9E8898DB00A",
  //         "encodingFormat": "SHA256"
  //       },
  //       "image": {
  //         "@type": "ImageObject",
  //         "contentUrl": "https://www.qldxray.com.au/wp-content/uploads/2018/03/imaging-provider-mobile.jpg",
  //         "encoding": "CF0BF0055AF44C1DFAC9FB48080DE93F6C1F54A220127C7EC37CA9E8898DB00A",
  //         "encodingFormat": "SHA256"
  //       },
  //       "image": {
  //         "@type": "ImageObject",
  //         "contentUrl": "https://www.qldxray.com.au/wp-content/uploads/2018/03/imaging-provider-mobile.jpg",
  //         "encoding": "CF0BF0055AF44C1DFAC9FB48080DE93F6C1F54A220127C7EC37CA9E8898DB00A",
  //         "encodingFormat": "SHA256"
  //       },
  //       "image": {
  //         "@type": "ImageObject",
  //         "contentUrl": "https://www.qldxray.com.au/wp-content/uploads/2018/03/imaging-provider-mobile.jpg",
  //         "encoding": "CF0BF0055AF44C1DFAC9FB48080DE93F6C1F54A220127C7EC37CA9E8898DB00A",
  //         "encodingFormat": "exp://192.168.1.7:19004/?req=https://id.uport.me/req/eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1NTg5NTQwNTIsInN1YiI6ImRpZDpldGhyOjB4YTBlZGFkNTc0MDhjMDA3MDJhM2YyMDQ3NmY2ODdmM2JmOGI2MWNjZiIsImNsYWltIjp7IkBjb250ZXh0IjoiaHR0c"
  //       },
  //       "image": {
  //         "@type": "ImageObject",
  //         "contentUrl": "https://www.qldxray.com.au/wp-content/uploads/2018/03/imaging-provider-mobile.jpg",
  //         "encoding": "CF0BF0055AF44C1DFAC9FB48080DE93F6C1F54A220127C7EC37CA9E8898DB00A",
  //         "encodingFormat": "exp://192.168.1.7:19004/?req=https://id.uport.me/req/eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1NTg5NTQwNTIsInN1YiI6ImRpZDpldGhyOjB4YTBlZGFkNTc0MDhjMDA3MDJhM2YyMDQ3NmY2ODdmM2JmOGI2MWNjZiIsImNsYWltIjp7IkBjb250ZXh0IjoiaHR0cHM6Ly9zY2hlbWEub3JnIiwiQHR5cGUiOiJEaWFnbm9zdGljUHJvY2VkdXJlIiwibmFtZSI6IlgtUmF5IFNjYW4gUmVzdWx0IiwiYm9keUxvY2F0aW9uIjoiTGVnIi"
  //       },
  //       "image": {
  //         "@type": "ImageObject",
  //         "contentUrl": "https://www.qldxray.com.au/wp-content/uploads/2018/03/imaging-provider-mobile.jpg",
  //         "encoding": "CF0BF0055AF44C1DFAC9FB48080DE93F6C1F54A220127C7EC37CA9E8898DB00A",
  //         "encodingFormat": "exp://192.168.1.7:19004/?req=https://id.uport.me/req/eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1NTg5NTQwNTIsInN1YiI6ImRpZDpldGhyOjB4YTBlZGFkNTc0MDhjMDA3MDJhM2YyMDQ3NmY2ODdmM2JmOGI2MWNjZiIsImNsYWltIjp7IkBjb250ZXh0IjoiaHR0c"
  //       }
  //     }
  //   }
  //}
  const cred2 = new Credentials({
    did: 'did:ethr:0x09e3e5a2bfb3acaf00a52b458ef119801be0fdaf',
    privateKey: 'ef1e30f73a7928847edef91c0ead3a2b43d6040b6e85d4d77f56deeaa4d1cf95'
  })
  cred2.createVerification({
    sub: 'did:ethr:0xa0edad57408c00702a3f20476f687f3bf8b61ccf',
    exp: Time360Days(),
    vct: '',
    claim: credentialSubject
  }).then(att => {
    var uri = message.paramsToQueryString(message.messageToURI(att), {
      callback_type: 'post'
    })
    const qr = transports.ui.getImageDataURI(uri)
    uri = helper.concatDeepUri(uri)
    messageLogger(att, 'Encoded VC Sent to User (Signed JWT)')
    messageLogger(decodeJWT(att), 'Decoded VC Payload of Above')
    res.render('retrieveVC', {
      qr: qr,
      uri: uri
    })
  })

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
    requested: ["Person"],
    notifications: false,
    callbackUrl: endpoint + '/login?socketid=' + socket.id
  }).then(requestToken => {
    var uri = message.paramsToQueryString(message.messageToURI(requestToken), {
      callback_type: 'post'
    })
    const qr = transports.ui.getImageDataURI(uri)
    uri = helper.concatDeepUri(uri)
    messageLogger(requestToken, "Request Token")
    socket.emit('qrLogin', {
      qr: qr,
      uri: uri
    })
  })

  socket.on('bookScan', function(booking) {
    console.log(currentConnections[socket.id].did + ' ' + booking.bookedTime)
    //31/05/2019 14:00
    let day = Number(booking.bookedTime.slice(0, 2))
    let month = Number(booking.bookedTime.slice(3, 5)) - 1
    let year = Number(booking.bookedTime.slice(6, 10))
    let hours = Number(booking.bookedTime.slice(11, 13))
    let minutes = Number(booking.bookedTime.slice(14, 16)) + 5
    let exp = (new Date(year, month, day, hours, minutes, 0, 0).getTime()) / 1000
    credentials.createVerification({
      sub: currentConnections[socket.id].did,
      exp: exp,
      claim: {
        "@context": "https://schema.org",
        "@type": "Reservation",
        "name": "X-Ray Scan Reservation",
        "bookingTime": booking.bookedTime,
        "reservationFor": {
          "@type": "MedicalProcedure",
          "bodyLocation": "Leg",
          "name": "X-Ray Scan"
        },
        "reservationId": "333444",
        "provider": {
          "@type": "Hospital",
          "name": booking.hospital,
        }
      }
    }).then(att => {
      var uri = message.paramsToQueryString(message.messageToURI(att), {
        callback_type: 'post'
      })
      const qr = transports.ui.getImageDataURI(uri)
      uri = helper.concatDeepUri(uri)
      messageLogger(att, 'Encoded VC Sent to User (Signed JWT)')
      messageLogger(decodeJWT(att), 'Decoded VC Payload of Above')
      currentConnections[socket.id].socket.emit('bookScanVC', {
        qr: qr,
        uri: uri
      })
    })
  })

  socket.on('disconnect', function() {
    console.log(socket.id + ' disconnected...')
    delete currentConnections[socket.id];
  })
});

http.listen(myhealth_port, () => {
  console.log(`http listening on port: ${myhealth_port}`)
  if (isDevEnv) {
    ngrok.connect(myhealth_port).then(ngrokUrl => {
      endpoint = ngrokUrl
      console.log(`MyHealth running, open at ${endpoint}`)
      open(endpoint, {
        app: 'chrome'
      })
    });
  }
})
