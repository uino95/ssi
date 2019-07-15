let BN = web3.utils.BN
let MultiSigOperations = artifacts.require('MultiSigOperations')
let PistisDIDRegistry = artifacts.require('PistisDIDRegistry')
let catchRevert = require("./exceptionsHelpers.js").catchRevert

contract('SupplyChain', function (accounts) {

    const deployer = accounts[0]
    const andrea = accounts[1]
    const matteo = accounts[2]
    const marco = accounts[2]
    const emptyAddress = '0x0000000000000000000000000000000000000000'

    const price = "1000"
    const excessAmount = "2000"
    const name = "book"

    let multiSigOperationsInstance
    let didRegistry

    beforeEach(async () => {
        multiSigOperationsInstance = await MultiSigOperations.new()
        didRegistry = await PistisDIDRegistry.new(2, multiSigOperationsInstance.address)
        await multiSigOperationsInstance.setPermissionRegistry(didRegistry.address)
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

    it("should add a new delegate with didRegistry permissions", async () => {
        await multiSigOperationsInstance.submitOperation(matteo, [], '', [andrea, matteo], [], {
            from: andrea
        })
        const minQuorum = await didRegistry.minQuorum.call(andrea)
        assert(minQuorum, 2, 'minQuorum should have increased to default quorum')
    })

})