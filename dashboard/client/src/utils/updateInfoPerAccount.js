import store from '../store'
import {
  hasConfirmed
} from './MultiSigOperations'
import {
  getMinQuorum
} from './pistisDIDRegistry'


// Task to be executed every time the account used change
export default function () {
  // update visibility based on permission
  const currentAddress = store.state.web3.address.toLowerCase()
  store.commit('updatePermissions', {
    authentication: store.getters.hasPermission(currentAddress, 'authentication'),
    statusRegMgmt: store.getters.hasPermission(currentAddress, 'statusRegMgmt'),
    tcmMgmt: store.getters.hasPermission(currentAddress, 'tcmMgmt')
  })

  updateConfirmPendingOperations()
}

export async function updateConfirmPendingOperations() {
  // update pending operations confirm
  store.state.pendingOperations.pistisDIDRegistry.map((op) => {
    updateOperation(op, 'pistisDIDRegistry')
  })
  store.state.pendingOperations.credentialStatusRegistry.map((op) => {
    updateOperation(op, 'credentialStatusRegistry')
  })
  store.state.pendingOperations.TCM.map((op) => {
    updateOperation(op, 'TCM')
  })
}

export async function updateOperation(op, contractType) {
  const result = await hasConfirmed(op.opId, store.state.web3.address)
  if (result !== store.state.pendingOperations[contractType][op.opId]) {
    store.commit('updatePendingOperations', {
      opId: op.opId,
      type: contractType,
      result: result
    })
  }
}

export async function updateMinQuorum() {
  let pistisDIDRegistryQuorum = await getMinQuorum(store.state.contracts.pistisDIDRegistry)
  let credentialStatusRegistryQuorum = await getMinQuorum(store.state.contracts.credentialStatusRegistry)
  //let TCMQuorum = await getMinQuorum(store.state.contracts.TCM)
  let TCMQuorum = 1
  store.commit('setMinQuorum', {
    pistisDIDRegistry: pistisDIDRegistryQuorum === 0 ? 1 : pistisDIDRegistryQuorum,
    credentialStatusRegistry: credentialStatusRegistryQuorum === 0 ? 1 : credentialStatusRegistryQuorum,
    TCM: TCMQuorum
  })
}