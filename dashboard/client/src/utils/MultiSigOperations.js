import Web3 from 'web3'

const jsonInterface = [{"constant":true,"inputs":[],"name":"operationsCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"address"}],"name":"confirmations","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"permissionRegistry","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"prova","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":false,"inputs":[{"name":"registryAddress","type":"address"}],"name":"setPermissionRegistry","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"provaFunction","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"identity","type":"address"},{"name":"intParams","type":"uint256[]"},{"name":"stringParams","type":"string"},{"name":"addressParams","type":"address[]"},{"name":"bytesParams","type":"bytes32[]"}],"name":"submitOperation","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"opId","type":"uint256"}],"name":"confirmOperation","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]

const contract_address = "0x8033EEf2B7243999f4d9D1998c6ec95052caC3E8"

const web3 = new Web3(Web3.givenProvider || null)

const multiSigOperations = new web3.eth.Contract(jsonInterface, contract_address)

export async function submitAddDelegate(data) {
    console.log(data)
    multiSigOperations.methods.submitOperation(data.identity, [1], '', [data.executor, data.delegate], []).send({from: data.from})
} 

export async function submitRevokeDelegate(data){
    multiSigOperations.methods.submitOperation(data.identity, [2], '', [data.executor, data.delegate], []).send({from: data.from})
}

export async function confirmAddDelegate(){}
export async function confirmRevokeDelegate(){}



//exports {
    // getCredentialStatus: async function (issuer, credentialId) {
    //     const address = parseDID(issuer)
    //     const result = await multiSigOperation.methods.credentialList(address.id, credentialId).call()
    //     return {
    //         status: result.credentialStatus,
    //         statusReason: web3.utils.toAscii(result.statusReason),
    //         time: result.time.toString()
    //     }
    // },

    // submitAddDelegate: async function (_issuer, _credentialId, _status, _statusReason) {
    //     const address = parseDID(_address)
    //     const issuer = parseDID(_issuer)
    //     const status = convertStatus(_status)
    //     const statusReason = web3.utils.fromAscii(_statusReason)
    //     const rawTransaction = await createAndSignTransaction(address, _pk, issuer, _credentialId, status, statusReason)

    //     web3.eth.sendSignedTransaction(rawTransaction)
    //         .once('transactionHash', function (hash) {
    //             console.log("here there is the transaction hash", hash)
    //         })
    // },
//}