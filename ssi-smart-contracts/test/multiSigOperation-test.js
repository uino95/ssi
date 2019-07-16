let BN = web3.utils.BN
let MultiSigOperations = artifacts.require('MultiSigOperations')
let PistisDIDRegistry = artifacts.require('PistisDIDRegistry')
let catchRevert = require("./exceptionsHelpers.js").catchRevert

contract('SupplyChain', function (accounts) {

    const deployer = accounts[0]
    const andrea = accounts[1]
    const matteo = accounts[2]
    const marco = accounts[3]
    const emptyAddress = '0x0000000000000000000000000000000000000000'

    let multiSigOperationsInstance
    let didRegistry

    before(async () => {
        multiSigOperationsInstance = await MultiSigOperations.deployed()
        didRegistry = await PistisDIDRegistry.deployed()
    })

    it("registry address should be set", async () => {
        const addr = await multiSigOperationsInstance.permissionRegistry.call()
        assert.equal(addr, didRegistry.address, 'registry address does not match')
    })

    it("should error while trying to set a new registry address", async () => {
        await catchRevert(multiSigOperationsInstance.setPermissionRegistry(emptyAddress, {
            from: deployer
        }))
    })

    it("only primary address should have permissions at first", async() => {
        const primaryAddress = await didRegistry.actorHasPermission(andrea, didRegistry.address, andrea)
        const otherAddress = await didRegistry.actorHasPermission(andrea, didRegistry.address, matteo)
        assert.equal(primaryAddress, true, 'should have had Permission')
        assert.equal(otherAddress, false, 'should not have had Permission')
    })

    it("should add a new delegate with didRegistry permissions", async () => {
        const b = await multiSigOperationsInstance.submitOperation(matteo, [1], '', [didRegistry.address, marco], [], {
            from: matteo
        })
        console.log(b)
        // assert(b, true, 'not true....')
        const minQuorum = await didRegistry.minQuorum.call(marco)
        const default_quorum = await didRegistry.DEFAULT_REQUIRED_QUORUM.call()
        assert.equal(minQuorum, default_quorum, 'minQuorum should have increased to default quorum')
    })

})