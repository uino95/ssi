let BN = web3.utils.BN
let MultiSigOperations = artifacts.require('MultiSigOperations')
let PistisDIDRegistry = artifacts.require('PistisDIDRegistry')
let CredentialStatusRegistry = artifacts.require('CredentialStatusRegistry')
let catchRevert = require("./exceptionsHelpers.js").catchRevert
let dataHelper = require("./dataHelpers.js")

contract('CredentialStatusRegistry', function (accounts) {

    const deployer = accounts[0]
    const andrea = accounts[1]
    const matteo = accounts[2]
    const marco = accounts[3]

    let multiSigOperationsInstance
    let didRegistry
    let credStatusReg

    async function editCredentialStatus(data) {
        await multiSigOperationsInstance.submitOperation(data.identity, credStatusReg.address, [data.credentialId, data.credentialStatus], '', [], [dataHelper.stringToBytes32(data.reason)], {
            from: data.from
        })
    }

    before(async () => {
        multiSigOperationsInstance = await MultiSigOperations.deployed()
        didRegistry = await PistisDIDRegistry.deployed()
        credStatusReg = await CredentialStatusRegistry.deployed()
    })

    it("registry address should be set", async () => {
        const addr = await multiSigOperationsInstance.permissionRegistry.call()
        assert.equal(addr, didRegistry.address, 'registry address does not match')
    })

    it("should error while trying to set a new registry address", async () => {
        await catchRevert(multiSigOperationsInstance.setPermissionRegistry(credStatusReg.address, {
            from: deployer
        }))
    })

    it("only primary address should have permissions at first", async () => {
        const primaryAddress = await didRegistry.actorHasPermission(andrea, credStatusReg.address, andrea)
        const otherAddress = await didRegistry.actorHasPermission(andrea, credStatusReg.address, matteo)
        assert.equal(primaryAddress, true, 'should have had Permission')
        assert.equal(otherAddress, false, 'should not have had Permission')
    })

    it("should error while trying to do operations without permissions", async () => {
        await catchRevert(editCredentialStatus({
            identity: andrea,
            credentialId: 1000,
            credentialStatus: 1,
            reason: "just testing",
            from: matteo
        }))
    })

    it("should revoke credential", async () => {
        await editCredentialStatus({
            identity: andrea,
            credentialId: 1000,
            credentialStatus: 1,
            reason: "revoked",
            from: andrea
        })
        const cred = await credStatusReg.credentialList.call(andrea, 1000)
        assert.equal(new BN(cred.credentialStatus).toString(10), new BN(1).toString(10), 'credential should be revoked')
    })

})