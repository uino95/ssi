var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const ngrok = require('ngrok')
const bodyParser = require('body-parser')
const Pistis = require('../../pistis/pistis.js')
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


let pistis = new Pistis('0x5e2397Babcb4307ba6DA8B1A602635dCAF8eBAA7', '5da6e8c3de50cca470eb9816994a9fb94286cd6ca5c2184b0b647ea596931ebf', 'did:pistis:0x5e2397Babcb4307ba6DA8B1A602635dCAF8eBAA7');

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

//Socket Events
io.on('connection', function(socket) {
  console.log('a user connected: ' + socket.id);
  currentConnections[socket.id] = {
    socket: socket
  };

  socket.on('vcreader_request', function(data) {
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

  socket.on('fetchDIDDocument', function(fn){
    pistis.resolveDIDDocument().then(doc => {
      fn(doc)
    })
  })

  // JUST to try selective disclosure with hash
  // socket.on('authVP', function(vp) {
  //   if (vp != null) {
  //     pistis.authenticateVP(vp).then(res => {
  //       messageLogger(res, 'Final Result of authenticateDisclosureResponse')
  //       //currentConnections[socketid].socket.emit('authenticatedCredentials', res)
  //     })
  //   }
  // })




  // let vc0 = new VerifiableCredential({
  //   subjectDID: 'did:ethr:0xa0edad57408c00702a3f20476f687f3bf8b61ccf',
  //   expiry: 50000,
  //   credentialSubject: {
  //     "@context": "https://schema.org",
  //     "@type": "DiagnosticProcedure",
  //     "name": "Mbareeeeeee",
  //     "bodyLocation": "<?f0?>",
  //     "outcome": {
  //       "@type": "MedicalEntity",
  //       "code": {
  //         "@type": "MedicalCode",
  //         "codeValue": "0123",
  //         "codingSystem": "ICD-10"
  //       },
  //       "legalStatus": {
  //         "@type": "MedicalImagingTechnique",
  //         "image": "..."
  //       }
  //     }
  //   }
  // })
  // vc0.addLargeFile({
  //   location: 'remote',
  //   content: 'https://www.qldxray.com.au/wp-content/uploads/2018/03/imaging-provider-mobile.jpg'
  // }).then(() => {
  //   let vc1 = new VerifiableCredential({
  //     subjectDID: 'did:ethr:0xa0edad57408c00702a3f20476f687f3bf8b61ccf',
  //     credentialSubject: {
  //       "@context": "https://schema.org",
  //       "@type": "CustomType",
  //       "name": "CiaoCred",
  //       "bodyLocation": "eheh"
  //     }
  //   })
  //   pistis.createAttestationVP([vc0, vc1]).then(vp => {
  //     messageLogger(vp, 'created VP')
  //     socket.emit('vcQr', {
  //       uri: Pistis.tokenToUri(vp, false),
  //       qr: Pistis.tokenToQr(vp, false)
  //     })
  //   })
  // })

  socket.on('vcbuilder_genQr', function(credential) {
    let vc = pistis.createVerifiableCredential(credential.vc, [], credential.data)
    pistis.createAttestationVP([vc]).then(vp => {
      messageLogger(vp, 'Generated VP')
      socket.emit('vcbuilder_vcQr', {
        uri: Pistis.tokenToUri(vp, false),
        qr: Pistis.tokenToQr(vp, false),
        vp: vp
      })
    })
  })

  socket.on('vcDisplayer_checkVCStatus', async function(data) {
    console.log('vcDisplayer_checkVCStatus...')
    var status = null
    try {
      status = await pistis.checkVCStatus(data.vc, data.tcl)
    } catch (err) {
      console.log(err)
    }
    socket.emit('vcDisplayer_checkVCStatus_reply', status)
  })

  socket.on('disconnect', function() {
    console.log(socket.id + ' disconnected...')
    delete currentConnections[socket.id];
  })

});

const port = 3000
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
