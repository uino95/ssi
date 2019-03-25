var express = require('express');
var app = express();
var http = require('http').Server(app);
const bodyParser = require('body-parser')

var opn = require('opn');

console.log('loading server...')

let endpoint = ''

const messageLogger = (message, title) => {
  const wrapTitle = title ? ` \n ${title} \n ${'-'.repeat(60)}` : ''
  const wrapMessage = `\n ${'-'.repeat(60)} ${wrapTitle} \n`
  console.log(wrapMessage)
  console.log(message)
}

app.use(bodyParser.json({ type: '*/*' }))

app.get('/', (req, res) => {
  let list = [
    {name: 'polimi', did: 'did:ethr:0xbc3ae59bc76f894822622cdef7a2018dbe353841'},
    {name: 'poliba', did: 'did:ethr:0xbc3ae59bc76f894822622cdef7a2018dbe353840'}
  ]
  return res.send(list)
})

http.listen(8088, () => {
  console.log(`Service running, open at ${endpoint}`)
  opn(endpoint, {app: 'chrome'})
})
