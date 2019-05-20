var express = require('express');
var app = express();
var http = require('http').Server(app);
const {mobileApp_port} = require('../poc_config/config.js')

app.get('/', function(req,res){
  res.send('hi there!');
});

console.log('loading server...')

http.listen(mobileApp_port, () => {
  console.log(`http listening on port: ${mobileApp_port}`)
})
