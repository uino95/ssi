var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const ngrok = require('ngrok')
const bodyParser = require('body-parser')
const Pistis = require('../itut/pistis.js')
const VerifiableCredential = require('../itut/verifiableCredential.js')

var ejs = require('ejs')
var open = require('open');

app.use(express.static(__dirname + 'views'));

const utils = require('./utils.js')

console.log('loading server...')

const Time30Days = () => Math.floor(new Date().getTime() / 1000) + 1 * 24 * 60 * 60
let endpoint = 'localhost:8088'

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

// const credentials = new Credentials({
//   did: 'did:ethr:0xbc3ae59bc76f894822622cdef7a2018dbe353840',
//   privateKey: '74894f8853f90e6e3d6dfdd343eb0eb70cca06e552ed8af80adadcc573b35da3'
// })

let pistis = new Pistis('0xbc3ae59bc76f894822622cdef7a2018dbe353840', '74894f8853f90e6e3d6dfdd343eb0eb70cca06e552ed8af80adadcc573b35da3');

/**
 *  First creates a disclosure request to get the DID (id) of a user. Also request push notification permission so
 *  a push can be sent as soon as a response from this request is received. The DID is used to create the attestation
 *  below. And a pushToken is used to push that attestation to a user.
 */

var currentConnections = {};

app.get('/', (req, res) => {
  res.render('home', {})
})

// app.post('/login', (req, res) => {
//   const jwt = req.body.access_token
//   const socketid = req.query['socketid']
//   if (jwt != null) {
//     console.log('someone logged in...')
//     credentials.authenticateDisclosureResponse(jwt).then(creds => {
//       messageLogger(decodeJWT(jwt), 'Shared VC from a User')
//       const did = creds.did
//       const pushToken = creds.pushToken
//       const pubEncKey = creds.boxPub
//       const user = utils.lookUpDIDPerson(did)
//       if (user != null) {
//         utils.logUserIn(socketid, user)
//       }
//       currentConnections[socketid].socket.emit('loginAction', user)
//     })
//     //else use username and password
//   } else {
//     //TODO
//   }
// });


//Socket Events
io.on('connection', function(socket) {
  console.log('a user connected: ' + socket.id);
  currentConnections[socket.id] = {
    socket: socket
  };

  // credentials.createDisclosureRequest({
  //   notifications: false,
  //   callbackUrl: endpoint + '/login?socketid=' + socket.id
  // }).then(requestToken => {
  //   const uri = message.paramsToQueryString(message.messageToURI(requestToken), {
  //     callback_type: 'post'
  //   })
  //   const qr = transports.ui.getImageDataURI(uri)
  //   messageLogger(requestToken, "Request Token")
  //   socket.emit('loginQr', {
  //     qr: qr,
  //     uri: uri
  //   })
  // })

  socket.on('disconnect', function() {
    console.log(socket.id + ' disconnected...')
    delete currentConnections[socket.id];
  })

  let vc0 = new VerifiableCredential({
    subjectDID: 'did:ethr:0xa0edad57408c00702a3f20476f687f3bf8b61ccf',
    expiry: 0,
    credentialSubject: {
      "@context": "https://schema.org",
      "@type": "DiagnosticProcedure",
      "name": "Mbareeeeeee",
      "bodyLocation": "<?f0?>",
      "outcome": {
        "@type": "MedicalEntity",
        "code": {
          "@type": "MedicalCode",
          "codeValue": "0123",
          "codingSystem": "ICD-10"
        },
        "legalStatus": {
          "@type": "MedicalImagingTechnique",
          "image": "..."
        }
      }
    }
  })
  vc0.addLargeFile({
    location: 'remote',
    url: 'https://www.qldxray.com.au/wp-content/uploads/2018/03/imaging-provider-mobile.jpg'
  }).then(() => {
    pistis.createAttestationVP([vc0]).then(vp => {
      console.log(vp)
      socket.emit('loginQr', {
        uri: Pistis.tokenToUri(vp, false),
        qr: Pistis.tokenToQr(vp, false)
      })
    })
  })

  // pistis.createVC({
  //   sub: 'did:ethr:0xa0edad57408c00702a3f20476f687f3bf8b61ccf',
  //   exp: Time30Days(),
  //   claim: credentialSubject
  // }).then(att => {
  //   // messageLogger(att, 'Encoded VC Sent to User (Signed JWT)')
  //   // messageLogger(decodeJWT(att), 'Decoded VC Payload of Above')
  //   socket.emit('loginQr', {
  //     uri: Pistis.tokenToUri(att),
  //     qr: Pistis.tokenToQr(att)
  //   })
  // })
  // let vcl = [//   "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1NjAyNDU1NDIsInN1YiI6ImRpZDpldGhyOjB4YTBlZGFkNTc0MDhjMDA3MDJhM2YyMDQ3NmY2ODdmM2JmOGI2MWNjZiIsImNsYWltIjp7IkBjb250ZXh0IjoiaHR0cHM6Ly9zY2hlbWEub3JnIiwiQHR5cGUiOiJNb25ldGFyeUFtb3VudCIsIm5hbWUiOiJBY2NvdW50IEJhbGFuY2UiLCJ2YWx1ZSI6IjE4MDAwMCIsImN1cnJlbmN5IjoiRVVSIiwidmFsaWRUaHJvdWdoIjoiMDYvMDYvMjAxOSJ9LCJleHAiOjE1NjAzMzE5NDIsImlzcyI6ImRpZDpldGhyOjB4ZWVlNmYzMjU4YTVjOTJlNGE2MTUzYTI3ZTI1MTMxMmZlOTVhMTlhZSJ9.VajJfM9LiiFNQCjS_p5weyYsAjUEmnESfZNtRm8Qoc66NXt7BxD9YYK6IJ9IzWMIJLifViGwZ7O9J-Y6lE7X6gA",
  //   "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1NjAyNDU1NDIsInN1YiI6ImRpZDpldGhyOjB4YTBlZGFkNTc0MDhjMDA3MDJhM2YyMDQ3NmY2ODdmM2JmOGI2MWNjZiIsImNsYWltIjp7IkBjb250ZXh0IjoiaHR0cHM6Ly9zY2hlbWEub3JnIiwiQHR5cGUiOiJCYW5rQWNjb3VudCIsIm5hbWUiOiJJQkFOIiwiaWRlbnRpZmllciI6eyJAdHlwZSI6ImlkZW50aWZpZXIiLCJhY2NvdW50SWQiOiJJVDYwWDA1NDI4MTExMDEwMDAwMDAxMjM0NTYiLCJsZWdpc3RhbHRpb25JZGVudGlmaWVyIjoiSXRhbHkifX0sImV4cCI6MTU2MDMzMTk0MiwiaXNzIjoiZGlkOmV0aHI6MHhlZWU2ZjMyNThhNWM5MmU0YTYxNTNhMjdlMjUxMzEyZmU5NWExOWFlIn0.lqqneO9mfACi6xghz8PFk0Zd9LnXCaYLD4pxRmBxkN7brtpFSM7Pls0TTPhE2dJTuaL5YD4ZBrwEjAdnHtJ_TAE"
  // ];
  // pistis.createAttestationVP(vcl).then(att => {
  //   // messageLogger(att, 'Encoded VC Sent to User (Signed JWT)')
  //   // messageLogger(decodeJWT(att), 'Decoded VC Payload of Above')
  //   socket.emit('loginQr', {
  //     uri: Pistis.tokenToUri(att),
  //     qr: Pistis.tokenToQr(att)
  //   })
  // })


});


http.listen(8088, () => {
  console.log('ready!!!')
  // open(endpoint, {
  //   app: 'chrome'
  // })
  // ngrok.connect(8088).then(ngrokUrl => {
  //   endpoint = ngrokUrl
  //   console.log(`Polimi Service running, open at ${endpoint}`)
  //   open(endpoint, {
  //     app: 'chrome'
  //   })
  // });
})
