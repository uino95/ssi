const Web3 = require('web3')
const LOCAL = false
const web3 = new Web3(Web3.providers.WebsocketProvider(LOCAL ? 'ws://172.31.51.161:7545' : 'wss://ropsten.infura.io/ws/v3/935826ef66134c5883e24a003a92819a'))

module.exports = web3