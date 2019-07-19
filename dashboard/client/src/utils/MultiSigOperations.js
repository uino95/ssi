import Web3 from 'web3'
import store from '../store'

const jsonInterface = [{"constant":true,"inputs":[],"name":"operationsCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"address"}],"name":"confirmations","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"permissionRegistry","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"prova","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":false,"inputs":[{"name":"registryAddress","type":"address"}],"name":"setPermissionRegistry","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"provaFunction","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"identity","type":"address"},{"name":"intParams","type":"uint256[]"},{"name":"stringParams","type":"string"},{"name":"addressParams","type":"address[]"},{"name":"bytesParams","type":"bytes32[]"}],"name":"submitOperation","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"opId","type":"uint256"}],"name":"confirmOperation","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]

const contract_address = store.state.contracts.multiSigOperations
const pistisDIDRegistryAddress = store.state.contracts.pistisDIDRegistry

const web3 = new Web3(Web3.givenProvider || null)

const multiSigOperations = new web3.eth.Contract(jsonInterface, contract_address)

export async function submitAddDelegate(data) {
    console.log(data)
    multiSigOperations.methods.submitOperation(data.identity, [1], '', [pistisDIDRegistryAddress, data.delegate, data.permission], []).send({from: data.from})
} 

export async function submitRevokeDelegate(data){
    multiSigOperations.methods.submitOperation(data.identity, [2], '', [pistisDIDRegistryAddress, data.delegate, data.permission], []).send({from: data.from})
}

export async function submitSetCredentialStatus(data) {
    console.log(data)
    multiSigOperations.methods.submitOperation(data.identity,[data.credentialId, data.credentialStatus],'', [], [web3.utils.fromAscii(data.statusReason)]).send({from: data.from})
} 

export async function confirmOperation(opId, from){
    console.log(opId)
    multiSigOperations.methods.confirmOperation(opId).send({from: from})
}