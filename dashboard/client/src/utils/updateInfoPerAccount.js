import {
  hasConfirmed
} from './MultiSigOperations'
import store from '../store'

// Task to be executed every time the account used change
export default function () {
  // update visibility based on permission
  // const currentAddress = store.state.web3.address
  // console.log(store.getters.hasPermission(currentAddress))
  // store.commit('updatePermissions', {
  //   authentication: store.getters.hasPermission(currentAddress, 'authentication') ,
  //   statusRegMgmt: store.getters.hasPermission(currentAddress, 'statusRegMgmt') ,
  //   tcmMgmt: store.getters.hasPermission(currentAddress, 'tcmMgmt') 
  // })
  updateConfirmPendingOperations()
}

export async function updateConfirmPendingOperations(){
  // update pending operations confirm
  store.state.pendingOperations.pistisDIDRegistry.map( (op) => {
    updateOperation(op, 'pistisDIDRegistry')
  })
  store.state.pendingOperations.credentialStatusRegistry.map( (op) => {
    updateOperation(op, 'credentialStatusRegistry')
  })
  store.state.pendingOperations.TCM.map( (op) => {
    updateOperation(op, 'TCM')
  })
}

export async function updateOperation(op, contractType){
  const result = await hasConfirmed(op.opId, store.state.web3.address)
  if (result !== store.state.pendingOperations[contractType][op.opId]) {
    store.commit('updatePendingOperations', {
      opId: op.opId,
      type: contractType,
      result: result
    })
  }
}