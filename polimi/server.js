var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const ngrok = require('ngrok')
const bodyParser = require('body-parser')
const Pistis = require('../pistis/pistis.js')
const VerifiableCredential = require('../pistis/verifiableCredential.js')

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

  pistis.createDisclosureRequest({
    requested: ["*"],
    callbackUrl: endpoint + '/login?socketid=' + socket.id
  }).then(token => {
    console.log(token)
    socket.emit('loginQr', {
      uri: Pistis.tokenToUri(token, false),
      qr: Pistis.tokenToQr(token, false)
    })
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
    content: 'https://www.qldxray.com.au/wp-content/uploads/2018/03/imaging-provider-mobile.jpg'
  }).then(() => {
    pistis.createAttestationVP([vc0]).then(vp => {
      console.log(vp)
      socket.emit('loginQr', {
        uri: Pistis.tokenToUri(vp, false),
        qr: Pistis.tokenToQr(vp, false)
      })
    })
  })



  socket.on('disconnect', function() {
    console.log(socket.id + ' disconnected...')
    delete currentConnections[socket.id];
  })

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
