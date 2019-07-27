import Vue from 'vue'
import Vuex from 'vuex'
import getWeb3 from './utils/getWeb3'
import pollWeb3 from './utils/pollWeb3'
import {
  parseDIDDOcumentForDelegates
} from './utils/parseDID'
import {updateConfirmPendingOperations, updateMinQuorum, updatePermissions} from './utils/updateInfoPerAccount';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    identity: '0x85FD638BD834Fa28FFa70bf29c6BF8585aE7d6a5',
    contracts: {
      multiSigOperations: null,
      pistisDIDRegistry: null,
      credentialStatusRegistry: null,
    },
    lastUpdate: '123455688',
    credentials: [{
        iat: '1562000791383',
        iss: '3984324',
        csu: {
          name: 'Cred1'
        }
      },
      {
        iat: '1562000793343',
        iss: '3984324',
        csu: {
          name: 'Cred2'
        }
      },
      {
        "iat": 1562077338339,
        "exp": 1,
        "sub": "did:ethr:0x45",
        "iss": "did:ethr:0x85FD638BD834Fa28FFa70bf29c6BF8585aE7d6a5",
        "csu": {
          "context": "https://schema.org",
          "name": "My Address",
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "streeAddress": "strada cà cornuta, 2"
          }
        },
        "csl": {
          "id": 0,
          "type": "Pistis-CSL/v1.0"
        }
      }
    ],
    delegates: {
      authentication: [],
      statusRegMgmt: [],
    },
    pendingOperations: {
      pistisDIDRegistry: [],
      credentialStatusRegistry: [],
      mainOperationLoading: false
    },
    minQuorum:{
      pistisDIDRegistry: 2,
      credentialStatusRegistry: 2,
    },
    permission: {
      authentication: false,
      statusRegMgmt: false,
    },
    web3: {
      web3Instance: null,
      address: null
    },
  },
  mutations: {
    addVC(state, payload) {
      state.credentials.push(payload.newVC)
    },
    registerWeb3Instance(state, payload) {
      console.log('registerWeb3instance Mutation being executed', payload)
      let result = payload
      let web3Copy = state.web3
      web3Copy.web3Instance = result.web3
      state.web3 = web3Copy
    },
    pollWeb3Instance (state, payload) {
      console.log('pollWeb3Instance mutation being executed', payload)
      state.web3.address = payload.toLowerCase()
    },
    SOCKET_contractsAddress(state, payload){
      state.contracts.credentialStatusRegistry = payload.credentialStatusRegistry;
      state.contracts.multiSigOperations = payload.multiSigOperations;
      state.contracts.pistisDIDRegistry = payload.pistisDIDRegistry;
    },
    SOCKET_DIDDocument(state, payload){
      const delegates = parseDIDDOcumentForDelegates(payload)
      state.delegates = delegates
      state.pendingOperations.mainOperationLoading = false
      updateMinQuorum()
      updatePermissions()
    },
    SOCKET_pendingOperations(state, payload){
      state.pendingOperations.credentialStatusRegistry = []
      state.pendingOperations.pistisDIDRegistry = []
      payload.map(op => {
        let res = {}
        res.opId = op.opId;
        res.pendingInfo = op.opId //change it with actual pending info
        res.confirmationsCount = op.confirmationsCount
        res.alreadyConfirmed = false
        res.loading = true
        if(op.executor === state.contracts.pistisDIDRegistry){
          state.pendingOperations.pistisDIDRegistry.push(res)
        } else if(op.executor === state.contracts.credentialStatusRegistry){
          state.pendingOperations.credentialStatusRegistry.push(res)
        }
      })
      state.pendingOperations.mainOperationLoading = false
      setTimeout(()=> {
        updateConfirmPendingOperations()
        state.pendingOperations.pistisDIDRegistry.map(op => op.loading = false)
        state.pendingOperations.credentialStatusRegistry.map(op => op.loading = false)
      }, 5000)
    },
    updatePendingOperations(state, payload){
      let op = state.pendingOperations[payload.type].find(op => op.opId === payload.opId)
      if(payload.hasOwnProperty('result')){
        op.alreadyConfirmed = payload.result
      }
      if(payload.hasOwnProperty('loading')){
        op.loading = payload.loading
      }
    },
    updatePermissions(state, payload){
      state.permission = payload
    },
    setMainOperationLoading(state,payload){
      state.pendingOperations.mainOperationLoading = payload
    },
    setMinQuorum(state, payload){
      state.minQuorum = payload
    },
    stopLoading(state, payload){
      if(payload.type === 'mainOperationLoading'){
        state.pendingOperations[payload.type] = false
      } else {
        let op = state.pendingOperations[payload.type].find(el => el.opId === payload.opId)
        op.loading = false
      }
    }
  },

  actions: {
    async registerWeb3(context) {
      try {
        console.log('registerWeb3 Action being executed')
        const result = await getWeb3()
        context.commit('registerWeb3Instance', result)
      } catch (err) {
        console.log("error in registerWeb3 action", err)
      }
      pollWeb3()
    },
    pollWeb3 ({commit}, payload) {
      console.log('pollWeb3 action being executed')
      commit('pollWeb3Instance', payload)
    },
  },

  getters: {
    hasPermission: (state) => (address, permissionType) => {
      return state.delegates[permissionType].includes(address)
    }
  }
})