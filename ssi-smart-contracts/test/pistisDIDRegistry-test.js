let BN = web3.utils.BN
let MultiSigOperations = artifacts.require('MultiSigOperations')
let PistisDIDRegistry = artifacts.require('PistisDIDRegistry')
let catchRevert = require("./exceptionsHelpers.js").catchRevert

contract('PistisDIDRegistry', function (accounts) {

    const deployer = accounts[0]
    const andrea = accounts[1]
    const matteo = accounts[2]
    const marco = accounts[3]

    let multiSigOperationsInstance
    let didRegistry

    async function addDelegate(data) {
        await multiSigOperationsInstance.submitOperation(data.identity, [1], '', [data.executor, data.delegate], [], {
            from: data.from
        })
    }

    before(async () => {
        multiSigOperationsInstance = await MultiSigOperations.deployed()
        didRegistry = await PistisDIDRegistry.deployed()
    })

    it("registry address should be set", async () => {
        const addr = await multiSigOperationsInstance.permissionRegistry.call()
        assert.equal(addr, didRegistry.address, 'registry address does not match')
    })

    it("should error while trying to set a new registry address", async () => {
        await catchRevert(multiSigOperationsInstance.setPermissionRegistry(didRegistry.address, {
            from: deployer
        }))
    })

    it("only primary address should have permissions at first", async () => {
        const primaryAddress = await didRegistry.actorHasPermission(andrea, didRegistry.address, andrea)
        const otherAddress = await didRegistry.actorHasPermission(andrea, didRegistry.address, matteo)
        assert.equal(primaryAddress, true, 'should have had Permission')
        assert.equal(otherAddress, false, 'should not have had Permission')
    })

    let subject = matteo
    let delegate1 = andrea
    let delegate2 = marco
    it("should error while trying to do operations without permissions", async () => {
        //delegate tries to add himself without permission
        await catchRevert(addDelegate({
            identity: subject,
            executor: didRegistry.address,
            delegate: delegate1,
            from: delegate1
        }))
    })

    it("should add a new delegate with didRegistry permissions", async () => {
        await addDelegate({
            identity: subject,
            executor: didRegistry.address,
            delegate: delegate1,
            from: subject
        })
        const minQuorum = await didRegistry.minQuorum.call(subject)
        const default_quorum = await didRegistry.DEFAULT_REQUIRED_QUORUM.call()
        assert.equal(new BN(minQuorum).toString(10), new BN(default_quorum).toString(10), 'minQuorum should have increased to default quorum')
    })

    it("should not add a delegate before confirmation", async () => {
        await addDelegate({
            identity: subject,
            executor: didRegistry.address,
            delegate: delegate2,
            from: delegate1
        })
        var del2HasPermission = await didRegistry.actorHasPermission(subject, didRegistry.address, delegate2)
        assert.equal(del2HasPermission, false, "delegate 2 should not have permission yet")
    })

    it("should add delegate after operation is confirmed", async () => {
        const opId = await multiSigOperationsInstance.operationsCount.call()
        await catchRevert(multiSigOperationsInstance.confirmOperation(opId, {
            from: delegate2
        }))
        await catchRevert(multiSigOperationsInstance.confirmOperation(opId, {
            from: delegate1
        }))
        await multiSigOperationsInstance.confirmOperation(opId, {
            from: subject
        })
        del2HasPermission = await didRegistry.actorHasPermission(subject, didRegistry.address, delegate2)
        assert.equal(del2HasPermission, true, "delegate 2 should have permission by now")
    })

})