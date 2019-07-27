import web3 from './web3_config.js'

const jsonInterface = [{ "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "uint256" }], "name": "credentialList", "outputs": [{ "name": "credentialStatus", "type": "uint8" }, { "name": "statusReason", "type": "bytes32" }, { "name": "time", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [{ "name": "_requiredCount", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "constant": false, "inputs": [{ "name": "_issuer", "type": "address" }, { "name": "_credentialId", "type": "uint256" }, { "name": "_credentialStatus", "type": "uint8" }, { "name": "_statusReason", "type": "bytes32" }, { "name": "_opId", "type": "uint256" }], "name": "setCredentialStatus", "outputs": [{ "name": "opID", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_issuer", "type": "address" }, { "name": "delegate", "type": "address" }, { "name": "validity", "type": "uint256" }, { "name": "_opId", "type": "uint256" }], "name": "addDelegate", "outputs": [{ "name": "opID", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_issuer", "type": "address" }, { "name": "delegate", "type": "address" }, { "name": "_opId", "type": "uint256" }], "name": "revokeDelegate", "outputs": [{ "name": "opID", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }]
const constants = require('./constants');

const statuRegistry = new web3.eth.Contract(jsonInterface, constants.credentialStatusRegistry)

function parseDID(did) {
    if (did === '') throw new Error('Missing DID')
    const sections = did.match(/^did:([a-zA-Z0-9_]+):([[a-zA-Z0-9_.-]+)(\/[^#]*)?(#.*)?$/)
    if (sections) {
        const parts = { did: sections[0], method: sections[1], id: sections[2] }
        if (sections[3]) parts.path = sections[3]
        if (sections[4]) parts.fragment = sections[4].slice(1)
        return parts
    }
    throw new Error(`Invalid DID ${did}`)
}

function convertStatus(status) {
    switch (status) {
        case "VALID":
            return 0;
            break;
        case "REVOKED":
            return 1;
            break;
        case "SUSPENDED":
            return 2;
            break;
        default:
            throw new Error("< " + status + " > it isn't a valid status")
    }
}

async function createAndSignTransaction(address, pk, issuer, credentialId, status, statusReason) {
    var data = statuRegistry.methods.setCredentialStatus(issuer.id, credentialId, status, statusReason, 0).encodeABI();
    const tx = await web3.eth.accounts.signTransaction({
        nonce: await web3.eth.getTransactionCount(address.id),
        to: constants.credentialStatusRegistry,
        gas: 2000000, 
        data: data
    }, pk)
    return tx.rawTransaction;
}

module.exports = {
    getCredentialStatus: async function(issuer, credentialId) {
        const address = parseDID(issuer)
        const result = await statuRegistry.methods.credentialList(address.id, credentialId).call()
        return {
            status: result.credentialStatus,
            statusReason: web3.utils.toAscii(result.statusReason),
            time: result.time.toString()
        }
    },

    setCredentialStatus: async function(_pk, _address, _issuer, _credentialId, _status, _statusReason) {
        const address = parseDID(_address)
        const issuer = parseDID(_issuer)
        const status = convertStatus(_status)
        const statusReason = web3.utils.fromAscii(_statusReason)
        const rawTransaction = await createAndSignTransaction(address, _pk, issuer, _credentialId, status, statusReason)

        web3.eth.sendSignedTransaction(rawTransaction)
            .once('transactionHash', function(hash){console.log("here there is the transaction hash", hash)})
    }
}