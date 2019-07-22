let BN = web3.utils.BN
let MultiSigOperations = artifacts.require('MultiSigOperations')
let PistisDIDRegistry = artifacts.require('PistisDIDRegistry')
let catchRevert = require("./exceptionsHelpers.js").catchRevert

contract('MultiSigOperations', function (accounts) {

    const deployer = accounts[0]
    const andrea = accounts[1]
    const matteo = accounts[2]
    const marco = accounts[3]

    let multiSigOperationsInstance
    let didRegistry

    async function submitOperation(data) {
        return await multiSigOperationsInstance.submitOperation(data.identity, didRegistry.address, [1], '', [data.delegate, data.permission], [], {
            from: data.from
        })
    }

    before(async () => {
        multiSigOperationsInstance = await MultiSigOperations.new()
        didRegistry = await PistisDIDRegistry.new(2, multiSigOperationsInstance.address)
        multiSigOperationsInstance.setPermissionRegistry(didRegistry.address, {
            from: deployer
        })
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

    let subject = andrea
    let delegate1 = matteo
    let delegate2 = marco
    it("should error while trying to do operations without permissions", async () => {
        //delegate tries to add himself without permission
        await catchRevert(submitOperation({
            identity: subject,
            permission: didRegistry.address,
            delegate: delegate1,
            from: delegate1
        }))
    })

    it("should execute operation at first confirmation along with events", async () => {
        let eventsEmitted = false
        const tx = await submitOperation({
            identity: subject,
            permission: didRegistry.address,
            delegate: delegate1,
            from: subject
        })
        if (tx.logs[0].event == "Submission" && tx.logs[1].event == "Confirmation" && tx.logs[2].event == "Execution") {
            eventsEmitted = true
        }
        assert.equal(eventsEmitted, true, 'should emit Sumbission, Confirmation, Execution events')
        let isDelegate = await didRegistry.delegates.call(subject, didRegistry.address, delegate1)
        assert.equal(isDelegate, true, "should have added a new delegate")
    })


    it("should not execute before confirmation", async () => {
        let eventsEmitted = false
        const tx = await submitOperation({
            identity: subject,
            permission: didRegistry.address,
            delegate: delegate2,
            from: subject
        })
        if (tx.logs[0].event == "Submission" && tx.logs[1].event == "Confirmation") {
            eventsEmitted = true
        }

        assert.equal(eventsEmitted, true, 'should emit Sumbission, Confirmation events')
        var del2HasPermission = await didRegistry.actorHasPermission(subject, didRegistry.address, delegate2)
        assert.equal(del2HasPermission, false, "delegate 2 should not have permission yet")
    })

    it("should be able to revoke confirmation along with Revocation event", async () => {
        let eventsEmitted = false
        let opId = await multiSigOperationsInstance.operationsCount.call()
        const tx = await multiSigOperationsInstance.revokeConfirmation(opId, {
            from: subject
        })
        if (tx.logs[0].event == "Revocation") {
            eventsEmitted = true
        }

        assert.equal(eventsEmitted, true, 'should emit Revocation events')
        let op = await multiSigOperationsInstance.operations.call(opId)
        assert.equal(op.confirmationsCount, 0, "operation should have zero confirmations")
    })

    it("operation should have 2 confirmation and should be executed after 2 confirmations", async () => {
        let eventsEmitted = false
        let opId = await multiSigOperationsInstance.operationsCount.call()
        const tx = await multiSigOperationsInstance.confirmOperation(opId, {
            from: delegate1
        })
        const tx2 = await multiSigOperationsInstance.confirmOperation(opId, {
            from: subject
        })
        if (tx.logs[0].event == "Confirmation" && tx2.logs[1].event == "Execution") {
            eventsEmitted = true
        }

        assert.equal(eventsEmitted, true, 'should emit Revocation events')
        let op = await multiSigOperationsInstance.operations.call(opId)
        assert.equal(op.confirmationsCount, 2, "operation should have zero confirmations")
        assert.equal(op.executed, true, "operation should be executed")
    })

})