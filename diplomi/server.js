var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const ngrok = require('ngrok')
const bodyParser = require('body-parser')
const {
  isDevEnv,
  port,
  callback_endpoint
} = require('../poc_config/config.js')

var ejs = require('ejs')
var open = require('open');

app.use(express.static(__dirname + 'views'));


import {
  Credentials
} from 'uport-credentials'

var currentConnections = {};
var tcl = require('./tcl.json')
var tcm = require('../itut/tcm.js')

const decodeJWT = require('did-jwt').decodeJWT
const transports = require('uport-transports').transport
const message = require('uport-transports').message.util
const helper = require('../itut/helper.js')

console.log('loading server...')

const Time30Days = () => Math.floor(new Date().getTime() / 1000) + 1 * 24 * 60 * 60
let endpoint = callback_endpoint + ':' + port

app.use(bodyParser.json({
  type: '*/*'
}))

//Setting up EJS view Engine and where to get the views from
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('views/uniroma'))


app.get('/', (req, res) => {
  res.render('eid-provider/home', {})
})


// UniRoma
const credentials0 = new Credentials({
  did: 'did:ethr:0xeee6f3258a5c92e4a6153a27e251312fe95a19ae',
  privateKey: 'a1c2779e0e3476ac51183ff5d3f7b6045cc28d615ed21d15b7707c22e0f8174c'
})
app.get('/uniroma3', (req, res) => {
  res.render('uniroma/index', {})
})
app.post('/uniromaLogin', (req, res) => {
  const jwt = req.body.access_token
  const socketid = req.query['socketid']
  console.log('someone sent a vc')
  if (jwt != null) {
    credentials0.authenticateDisclosureResponse(jwt).then(creds => {
      console.log('ok....logged in to uniroma')
      currentConnections[socketid].socket.emit('loggedIn', {})
    })
  }
});


// VC Reader
const credentials2 = new Credentials({
  did: 'did:ethr:0xbc3ae59bc76f894822622cdef7a2018dbe353840',
  privateKey: '74894f8853f90e6e3d6dfdd343eb0eb70cca06e552ed8af80adadcc573b35da3'
})
app.get('/vcreader', (req, res) => {
  res.render('vcreader/vcreader', {})
})
app.post('/vcreader', (req, res) => {
  const jwt = req.body.access_token
  const socketid = req.query['socketid']
  console.log('someone sent a vc')
  if (jwt != null) {
    credentials2.authenticateDisclosureResponse(jwt).then(creds => {
      let objectToSend = {
        sender: creds.did,
        vcs: []
      }
      creds = creds.verified
      for (var i = 0; i < creds.length; i++) {
        let ent = tcm.searchEntity(creds[i].iss)
        let selfStated = (ent != null ? false : true)
        if (selfStated) {
          ent = creds[i].ent
        }
        objectToSend.vcs.push({
          iat: creds[i].iat,
          sub: creds[i].sub,
          credentialSubject: creds[i].claim,
          exp: creds[i].exp,
          iss: creds[i].iss,
          ent: {
            ent: ent,
            selfStated: selfStated
          }
        })
      }
      console.log(objectToSend)
      currentConnections[socketid].socket.emit('emitVC', objectToSend)
    })
  }
});

///////// eid-provider
app.post('/login', (req, res) => {
  const jwt = req.body.access_token
  const socketid = req.query['socketid']
  console.log('someone logged in...')

  if (jwt != null) {
    credentials2.authenticateDisclosureResponse(jwt).then(creds => {
      console.log('in...')
      // messageLogger(decodeJWT(jwt), 'Shared VC from a User')
      const did = creds.did
      credentials2.createVerification({
        sub: did,
        exp: Time30Days(),
        claim: {
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "E-ID",
          "givenName": "Andrea",
          "familyName": "Taglia",
          "taxID": "0123456789"
        }
      }).then(att => {
        var uri = message.paramsToQueryString(message.messageToURI(att), {
          callback_type: 'post'
        })
        const qr = transports.ui.getImageDataURI(uri)
        uri = helper.concatDeepUri(uri)
        // messageLogger(att, 'Encoded VC Sent to User (Signed JWT)')
        // messageLogger(decodeJWT(att), 'Decoded VC Payload of Above')
        currentConnections[socketid].socket.emit('emitVC1', {
          qr: qr,
          uri: uri
        })
      })
    })
  }
});


///////////////////////////////////////////////////////////////////////////////////
////////////////////////////// Socket Events
///////////////////////////////////////////////////////////////////////////////////

io.on('connection', function(socket) {
  console.log('a user connected: ' + socket.id);
  currentConnections[socket.id] = {
    socket: socket
  };

  ///////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////// Eid Provider ///////////////////////////////////////////////

  credentials2.createDisclosureRequest({
    // requested: ["name"],
    notifications: false,
    callbackUrl: endpoint + '/login?socketid=' + socket.id
  }).then(requestToken => {
    var uri = message.paramsToQueryString(message.messageToURI(requestToken), {
      callback_type: 'post'
    })
    const qr = transports.ui.getImageDataURI(uri)
    uri = helper.concatDeepUri(uri)
    // messageLogger(requestToken, "Request Token")
    socket.emit('emitDidVC', {
      qr: qr,
      uri: uri
    })
  })

  ///////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////// UniRoma ///////////////////////////////////////////////
  credentials0.createDisclosureRequest({
    requested: ["Person"],
    notifications: false,
    callbackUrl: endpoint + '/uniromaLogin?socketid=' + socket.id
  }).then(requestToken => {
    var uri = message.paramsToQueryString(message.messageToURI(requestToken), {
      callback_type: 'post'
    })
    const qr = transports.ui.getImageDataURI(uri)
    uri = helper.concatDeepUri(uri)
    socket.emit('uniroma-qrLogin', {
      qr: qr,
      uri: uri
    })
  })

  credentials0.createVerification({
    sub: "did:ethr:0xa0edad57408c00702a3f20476f687f3bf8b61ccf",
    exp: Time30Days(),
    claim: {
      "@context": "https://schema.org",
      "name": "Matricola"
      "@type": "Person",
      "identifier": "888990"
    }
  }).then(att => {
    var uri = message.paramsToQueryString(message.messageToURI(att), {
      callback_type: 'post'
    })
    const qr = transports.ui.getImageDataURI(uri)
    uri = helper.concatDeepUri(uri)
    socket.emit('uniroma-qrVC0', {
      qr: qr,
      uri: uri
    })
  })

  credentials0.createVerification({
    sub: "did:ethr:0xa0edad57408c00702a3f20476f687f3bf8b61ccf",
    exp: Time30Days(),
    claim: {
      "@context": "http://schema.org/",
      "@type": "ItemList",
      "name": "Exams",
      "exam0": {
        "@type": "Course",
        "courseCode": "F300",
        "name": "Informatica 1",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "28"
        }
      },
      "exam1": {
        "@type": "Course",
        "courseCode": "F400",
        "name": "Analisi 1",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "30L"
        }
      },
      "exam2": {
        "@type": "Course",
        "courseCode": "F500",
        "name": "Sicurezza delle Reti",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "25"
        }
      },
      "exam3": {
        "@type": "Course",
        "courseCode": "F604",
        "name": "Fisica Tecnica",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "18"
        }
      },
      "exam4": {
        "@type": "Course",
        "courseCode": "C201",
        "name": "Architetture dei Calcolatori",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "30"
        }
      }
    }
  }).then(att => {
    var uri = message.paramsToQueryString(message.messageToURI(att), {
      callback_type: 'post'
    })
    const qr = transports.ui.getImageDataURI(uri)
    uri = helper.concatDeepUri(uri)
    socket.emit('uniroma-qrVC1', {
      qr: qr,
      uri: uri
    })
  })


  credentials0.createVerification({
    sub: "did:ethr:0xa0edad57408c00702a3f20476f687f3bf8b61ccf",
    exp: Time30Days(),
    claim: {
      "context": "https://schema.org",
      "@type": "EducationalOccupationalCredential",
      "name": "University Degree",
      "credentialCategory": {
        "@type": "DefinedTerm",
        "name": "Computer Science Engineering",
        "termCode": "CSE"
      },
      "image": {
        "@type": "ImageObject",
        "contentUrl": "https://scontent-frt3-2.cdninstagram.com/vp/b80f33085ee7a4b1e4794abaa25172be/5D900EC9/t51.2885-15/e35/21980698_145857142687698_5460493589022769152_n.jpg?_nc_ht=scontent-frt3-2.cdninstagram.com&se=8&ig_cache_key=MTYxMjk1MjE5MDE0MTIyODE1OQ%3D%3D.2",
        "encoding": "CF0BF0055AF44C1DFAC9FB48080DE93F6C1F54A220127C7EC37CA9E8898DB00A",
        "encodingFormat": "SHA256"
      },
      "educationalLevel": {
        "@type": "DefinedTerm",
        "name": "University Degree",
        "inDefinedTermSet": "https://www.eu-degrees.eu/degrees"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "110"
      }

    }
  }).then(att => {
    var uri = message.paramsToQueryString(message.messageToURI(att), {
      callback_type: 'post'
    })
    const qr = transports.ui.getImageDataURI(uri)
    uri = helper.concatDeepUri(uri)
    socket.emit('uniroma-qrVC2', {
      qr: qr,
      uri: uri
    })
  })




  ///////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////// VC Reader ///////////////////////////////////////////
  credentials2.createDisclosureRequest({
    verified: ["/*"],
    notifications: false,
    callbackUrl: endpoint + '/vcreader?socketid=' + socket.id
  }).then(requestToken => {
    var uri = message.paramsToQueryString(message.messageToURI(requestToken), {
      callback_type: 'post'
    })
    const qr = transports.ui.getImageDataURI(uri)
    uri = helper.concatDeepUri(uri)
    socket.emit('emitQR', {
      qr: qr,
      uri: uri
    })
  })
  tcm.setTcl(tcl)
  socket.emit('tcl', tcl)


  socket.on('disconnect', function() {
    console.log(socket.id + ' disconnected...')
    delete currentConnections[socket.id];
  })
});


http.listen(port, () => {
  console.log(`http listening on port: ${port}`)
  if (isDevEnv) {
    ngrok.connect(port).then(ngrokUrl => {
      endpoint = ngrokUrl
      console.log(`Diplomi PoC running, open at ${endpoint}`)
      open(endpoint, {
        app: 'chrome'
      })
    });
  }
})
