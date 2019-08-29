let BN = web3.utils.BN
let MultiSigOperations = artifacts.require('MultiSigOperations')
let PistisDIDRegistry = artifacts.require('PistisDIDRegistry')
let CredentialStatusRegistry = artifacts.require('CredentialStatusRegistry')
let catchRevert = require("./exceptionsHelpers.js").catchRevert

contract('PistisDIDRegistry', function (accounts) {

    const deployer = accounts[0]
    const andrea = accounts[1]
    const matteo = accounts[2]
    const marco = accounts[3]

    let multiSigOperationsInstance
    let didRegistry
    let credentialStatusRegistry

    async function addDelegate(data) {
        return await multiSigOperationsInstance.submitOperation(data.identity, didRegistry.address, [1], '', [data.delegate, data.permission], [], {
            from: data.from
        })
    }

    async function removeDelegate(data) {
        return await multiSigOperationsInstance.submitOperation(data.identity, didRegistry.address, [2], '', [data.delegate, data.permission], [], {
            from: data.from
        })
    }

    before(async () => {
        multiSigOperationsInstance = await MultiSigOperations.deployed()
        didRegistry = await PistisDIDRegistry.deployed()
        credentialStatusRegistry = await CredentialStatusRegistry.deployed()
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
        await catchRevert(addDelegate({
            identity: subject,
            permission: didRegistry.address,
            delegate: delegate1,
            from: delegate1
        }))
    })

    it("should add a new delegate with didRegistry permissions", async () => {
        let eventsEmitted = false
        const tx = await addDelegate({
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

    it("min quorum should have increased to the Default Minimum", async () => {
        const minQuorum = await didRegistry.minQuorum.call(subject, didRegistry.address)
        const default_quorum = await didRegistry.DEFAULT_REQUIRED_QUORUM.call()
        assert.equal(new BN(minQuorum).toString(10), new BN(default_quorum).toString(10), 'minQuorum should have increased to default quorum')
    })

    it("should not add a delegate before confirmation", async () => {
        await addDelegate({
            identity: subject,
            permission: didRegistry.address,
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

    it("should remove primary address delegate", async () => {
        await removeDelegate({
            identity: subject,
            permission: didRegistry.address,
            delegate: subject,
            from: delegate1
        })
        const opId = await multiSigOperationsInstance.operationsCount.call()
        await multiSigOperationsInstance.confirmOperation(opId, {
            from: delegate2
        })
        const primaryAddressChanged = await didRegistry.primaryAddressChanged.call(subject)
        assert.equal(primaryAddressChanged, true, 'primary address should have changed')
    })

    it("subject should not have permissions anymore", async() => {
        let isDelegate = await didRegistry.actorHasPermission.call(subject, didRegistry.address, subject)
        assert.equal(isDelegate, false, "subject should not have permissions on registry anymore")
        isDelegate = await didRegistry.actorHasPermission.call(subject, credentialStatusRegistry.address, subject)
        assert.equal(isDelegate, false, "subject should not have permissions anymore")
    })

    //after this primary identity is controlled by delegate1 and delegate 2
    
    it("should be able to remove a delegate", async() => {
        await removeDelegate({
            identity: subject,
            permission: didRegistry.address,
            delegate: delegate1,
            from: delegate2
        })
        const opId = await multiSigOperationsInstance.operationsCount.call()
        await multiSigOperationsInstance.confirmOperation(opId, {
            from: delegate1
        })
        const actorHasPermission = await didRegistry.actorHasPermission.call(subject, didRegistry.address, delegate1)
        assert.equal(actorHasPermission, false, 'delegate1 should not have permission anymore')
    })
    
    it("should not be able to remove last delegate, and quorum should still be 0", async() => {
        await catchRevert(removeDelegate({
            identity: subject,
            permission: didRegistry.address,
            delegate: delegate2,
            from: delegate2
        }))
        const minQuorum = await didRegistry.minQuorum.call(subject, didRegistry.address)
        assert.equal(minQuorum, 0, "should have reset minQuorum to 0")
    })
})