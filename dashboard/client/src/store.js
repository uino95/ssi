import Vue from 'vue'
import Vuex from 'vuex'
import getWeb3 from './utils/getWeb3'
import pollWeb3 from './utils/pollWeb3'
import {
  parseDIDDOcumentForDelegates
} from './utils/parseDID'
import {updateConfirmPendingOperations, updateOperation, updateMinQuorum} from './utils/updateInfoPerAccount';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    identity: '0x85FD638BD834Fa28FFa70bf29c6BF8585aE7d6a5',
    contracts: {
      multiSigOperations: null,
      pistisDIDRegistry: null,
      credentialStatusRegistry: null,
      TCM: null,
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
    tcl: {
      "@context": "pistis-tcl/v1",
      "tcl": [{
          src: "this",
          did: "did:ethr:0x09e3e5a2bfb3acaf00a52b458ef119801be0fdaf",
          ent: {
            type: "Person",
            name: "Doctor Who",
            familyName: "Who",
            givenName: "Jake",
            affiliation: {
              type: "Hospital",
              name: "St. Luke's Hospital",
              address: {
                type: "Postal Address",
                streetAddress: "St. Lukes Square",
                addressLocality: "G'Mangia Pieta",
                addressRegion: "PTA",
                postalCode: "1010"
              }
            }
          }
        },
        {
          src: "this",
          did: "did:ethr:0xdko03aw0j76f894824rt2cdef7a2018dbe32md97",
          ent: {
            type: "Person",
            name: "Doctor Abela",
            familyName: "Mark",
            givenName: "Abela",
            affiliation: {
              type: "Hospital",
              name: "St. Luke's Hospital",
              address: {
                type: "Postal Address",
                streetAddress: "St. Lukes Square",
                addressLocality: "G'Mangia Pieta",
                addressRegion: "PTA",
                postalCode: "1010"
              }
            }
          }
        },
        {
          src: "this",
          did: "did:ethr:0xbc3ae59bc76f894822622cdef7a2018dbe353840",
          ent: {
            type: "MedicalOrganization",
            name: "MyHealth",
            url: "https://myhealth-ng.gov.mt/"
          }
        },
        {
          src: "this",
          did: "did:ethr:0xeee6f3258a5c92e4a6153a27e251312fe95a19ae",
          ent: {
            type: "Organization",
            name: "IdentityMalta",
            url: "https://identitymalta.com"
          }
        },
        {
          src: "https://www.myhealth-ng.gov.mt/trsuted-contacts-list",
          did: null,
          ent: null
        }
      ]
    },
    delegates: {
      authentication: [],
      statusRegMgmt: [],
      tcmMgmt: []
    },
    pendingOperations: {
      pistisDIDRegistry: [],
      credentialStatusRegistry: [],
      TCM: [],
      mainOperationLoading: false
    },
    minQuorum:{
      pistisDIDRegistry: 2,
      credentialStatusRegistry: 2,
      TCM: 2
    },
    permission: {
      authentication: false,
      statusRegMgmt: false,
      tcmMgmt: false
    },
    vcBuilder: {
      credential: {},
      credentialBackup: {
        iat: new Date().getTime(),
        exp: 1,
        sub: "did:ethr:0x45",
        iss: "did:ethr:0x9fe146cd95b4ff6aa039bf075c889e6e47f8bd18",
        csu: {
          context: "https://schema.org",
          name: "My new credential"
        },
        csl: {
          id: 0,
          type: "Pistis-CSL/v1.0"
        }
      },
      credentialData: []
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
    editTCL(state, payload) {
      state.tcl = payload.tcl
    },
    updateVC(state, cred) {
      console.log("updating", cred)
      state.vcBuilder.credential = cred
    },
    updateData(state, data) {
      state.vcBuilder.credentialData = [...state.vcBuilder.credentialData, data]
    },
    deleteData(state) {
      state.vcBuilder.credentialData = []
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
      state.contracts.TCM = payload.TCM;
      state.contracts.credentialStatusRegistry = payload.credentialStatusRegistry;
      state.contracts.multiSigOperations = payload.multiSigOperations;
      state.contracts.pistisDIDRegistry = payload.pistisDIDRegistry;
    },
    SOCKET_DIDDocument(state, payload){
      const delegates = parseDIDDOcumentForDelegates(payload)
      state.delegates = delegates
      state.pendingOperations.mainOperationLoading = false
      console.log("DEEEEEEELEATEDSSS", state.delegates)
      updateMinQuorum()
    },
    SOCKET_pendingOperations(state, payload){
      state.pendingOperations.TCM = []
      state.pendingOperations.credentialStatusRegistry = []
      state.pendingOperations.pistisDIDRegistry = []
      payload.map(op => {
        let res = {}
        res.opId = op.opId;
        res.pendingInfo = op.opId //change it with actual pending info
        res.confirmationsCount = op.confirmationsCount
        res.alreadyConfirmed = false
        res.loading = false
        if(op.executor === state.contracts.pistisDIDRegistry){
          state.pendingOperations.pistisDIDRegistry.push(res)
          updateOperation(res,'pistisDIDRegistry')
        } else if(op.executor === state.contracts.credentialStatusRegistry){
          state.pendingOperations.credentialStatusRegistry.push(res)
          updateOperation(res, 'credentialStatusRegistry')
        } else {
          state.pendingOperations.TCM.push(res)
          updateOperation(res, 'TCM')
        }
      })
      state.pendingOperations.mainOperationLoading = false
      updateConfirmPendingOperations()
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
      console.log(payload)
      state.permission = payload
    },
    setMainOperationLoading(state,payload){
      state.pendingOperations.mainOperationLoading = payload
    },
    setMinQuorum(state, payload){
      state.minQuorum = payload
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
      console.log(state.delegates[permissionType].includes(address))
      console.log(state.delegates[permissionType])
      return state.delegates[permissionType].includes(address)
    }
  }
})