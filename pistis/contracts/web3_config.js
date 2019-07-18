const Web3 = require('web3')
const web3 = new Web3(Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"))

module.exports = web3