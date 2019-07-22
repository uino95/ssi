import {
  hasConfirmed
} from './MultiSigOperations'
import store from '../store'

export default async function () {
  const address = store.state.web3.address
  store.state.pendingOperations.pistisDIDRegistry.map(async (op) => {
    const result = await hasConfirmed(op.opId, address)
    if (result !== op.alreadyConfirmed) {
      store.commit('updatePendingOperations', {
        opId: op.opId,
        type: 'pistisDIDRegistry',
        result: result
      })
    }
  })

  store.state.pendingOperations.credentialStatusRegistry.map(async (op) => {
    const result = await hasConfirmed(op.opId, address)
    if (result !== op.alreadyConfirmed) {
      store.commit('updatePendingOperations', {
        opId: op.opId,
        type: 'credentialStatusRegistry',
        result: result
      })
    }
  })

  store.state.pendingOperations.TCM.map(async (op) => {
    const result = await hasConfirmed(op.opId, address)
    if (result !== op.alreadyConfirmed) {
      store.commit('updatePendingOperations', {
        opId: op.opId,
        type: 'TCM',
        result: result
      })
    }
  })


}