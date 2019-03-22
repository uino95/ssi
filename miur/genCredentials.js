import { Credentials } from 'uport-credentials'
const {did, privateKey} = Credentials.createIdentity()
console.log(did)
console.log(privateKey)
