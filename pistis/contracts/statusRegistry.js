const Web3 = require('web3')

const jsonInterface = [{ "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "uint256" }], "name": "credentialList", "outputs": [{ "name": "credentialStatus", "type": "uint8" }, { "name": "statusReason", "type": "bytes32" }, { "name": "time", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [{ "name": "_requiredCount", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "constant": false, "inputs": [{ "name": "_issuer", "type": "address" }, { "name": "_credentialId", "type": "uint256" }, { "name": "_credentialStatus", "type": "uint8" }, { "name": "_statusReason", "type": "bytes32" }, { "name": "_opId", "type": "uint256" }], "name": "setCredentialStatus", "outputs": [{ "name": "opID", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_issuer", "type": "address" }, { "name": "delegate", "type": "address" }, { "name": "validity", "type": "uint256" }, { "name": "_opId", "type": "uint256" }], "name": "addDelegate", "outputs": [{ "name": "opID", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_issuer", "type": "address" }, { "name": "delegate", "type": "address" }, { "name": "_opId", "type": "uint256" }], "name": "revokeDelegate", "outputs": [{ "name": "opID", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }]
const contract_address = "0xDc3173a4860E092957C7a42A69f992cB50D4D248"

const web3 = new Web3(Web3.providers.HttpProvider("https://ropsten.infura.io/v3/9b3e31b76db04cf2a6ff7ed0f1592ab9"))

const statuRegistry = new web3.eth.Contract(jsonInterface, contract_address)

function parseDID(did){
	if (did === '') throw new Error('Missing DID')
	const sections = did.match(/^did:([a-zA-Z0-9_]+):([[a-zA-Z0-9_.-]+)(\/[^#]*)?(#.*)?$/)
	if (sections) {
	    const parts = {did: sections[0], method: sections[1], id: sections[2]}
	    if (sections[3]) parts.path = sections[3]
	    if (sections[4]) parts.fragment = sections[4].slice(1)
	    return parts
  	}
  	throw new Error(`Invalid DID ${did}`)
}

module.exports = {
    getCredentialStatus: async function(issuer, credentialId) {
    	const address = parseDID(issuer)
        const result = await statuRegistry.methods.credentialList(address.id, credentialId).call()
    	const buf = new Buffer(result.statusReason.slice(2), 'hex')
        return  {
        	status: result.credentialStatus,
        	statusReason: result.credentialStatus != 0 ? buf.toString('ascii') : 0,
        	time: result.time.toString()
        }
    }
}