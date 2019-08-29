import Vue from 'vue'
import Vuex from 'vuex'
import getWeb3 from './utils/getWeb3'
import pollWeb3 from './utils/pollWeb3'
import {
  parseDIDDOcumentForDelegates
} from './utils/parseDID'
import {
  updateConfirmPendingOperations,
  updateMinQuorum,
  updatePermissions
} from './utils/updateInfoPerAccount';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    identity: null,
    contracts: {
      multiSigOperations: null,
      pistisDIDRegistry: null,
      credentialStatusRegistry: null,
    },
    lastUpdate: '123455688',
    credentials: [{
        "iat": 1562077338338,
        "exp": 1566950400000,
        "sub": "did:pistis:0xF8007e77c86c62184175455f2D97BfB1e3E350ea",
        "iss": null,
        "csu": {
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "E-ID",
          "givenName": "Andrea",
          "familyName": "Taglia",
          "gender": "male"
        },
        "csl": {
          "id": 0,
          "type": "Pistis-CSL/v1.0"
        }
      },
      {
        "iat": 1562077338339,
        "exp": 1564272000000,
        "sub": "did:pistis:0x0xA7B225557F9328C47FA1F601FdF44a793Fe85aa3",
        "iss": null,
        "csu": {
          "@context": "http://schema.org/",
          "@type": "ItemList",
          "name": "Exams",
          "exam0": {
            "@type": "Course",
            "courseCode": "F300",
            "name": "Foundations of Informatics",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "28"
            }
          },
          "exam1": {
            "@type": "Course",
            "courseCode": "F400",
            "name": "Calculus 1",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "30L"
            }
          },
          "exam2": {
            "@type": "Course",
            "courseCode": "F500",
            "name": "Network Security",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "25"
            }
          },
          "exam3": {
            "@type": "Course",
            "courseCode": "F604",
            "name": "Physics",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "18"
            }
          },
          "exam4": {
            "@type": "Course",
            "courseCode": "C201",
            "name": "Computer Architecture",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "30"
            }
          }
        },
        "csl": {
          "id": 1,
          "type": "Pistis-CSL/v1.0"
        }
      },
      {
        "iat": 1562077338340,
        "exp": 1577750400000,
        "sub": "did:ethr:0x85FD638BD834Fa28FFa70bf29c6BF8585aE7d6a5",
        "iss": null,
        "csu": {
          "context": "https://schema.org",
          "@type": "EducationalOccupationalCredential",
          "name": "University Degree",
          "credentialCategory": {
            "@type": "DefinedTerm",
            "name": "Computer Science Engineering",
            "termCode": "CSE"
          },
          "image": {
            "@type": "ImageObject",
            "contentUrl": "https://scontent-frt3-2.cdninstagram.com/vp/b80f33085ee7a4b1e4794abaa25172be/5D900EC9/t51.2885-15/e35/21980698_145857142687698_5460493589022769152_n.jpg?_nc_ht=scontent-frt3-2.cdninstagram.com&se=8&ig_cache_key=MTYxMjk1MjE5MDE0MTIyODE1OQ%3D%3D.2",
            "encoding": "CF0BF0055AF44C1DFAC9FB48080DE93F6C1F54A220127C7EC37CA9E8898DB00A",
            "encodingFormat": "SHA256"
          },
          "educationalLevel": {
            "@type": "DefinedTerm",
            "name": "University Degree",
            "inDefinedTermSet": "https://www.eu-degrees.eu/degrees"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "110"
          }

        },
        "csl": {
          "id": 2,
          "type": "Pistis-CSL/v1.0"
        }
      }
    ],
    delegates: {
      delegatesMgmt: [],
      statusRegMgmt: [],
    },
    pendingOperations: {
      pistisDIDRegistry: [],
      credentialStatusRegistry: [],
      mainOperationLoading: false
    },
    minQuorum: {
      pistisDIDRegistry: 2,
      credentialStatusRegistry: 2,
    },
    permission: {
      delegatesMgmt: false,
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
    pollWeb3Instance(state, payload) {
      console.log('pollWeb3Instance mutation being executed', payload)
      state.web3.address = payload.toLowerCase()
    },
    SOCKET_contractsAddress(state, payload) {
      state.contracts.credentialStatusRegistry = payload.credentialStatusRegistry;
      state.contracts.multiSigOperations = payload.multiSigOperations;
      state.contracts.pistisDIDRegistry = payload.pistisDIDRegistry;
    },
    SOCKET_DIDDocument(state, payload) {
      const {
        delegates,
        identity
      } = parseDIDDOcumentForDelegates(payload)
      state.delegates = delegates
      state.pendingOperations.mainOperationLoading = false
      state.identity = identity
      state.credentials.map(cred => cred.iss = 'did:pistis:' + identity)
      //updateMinQuorum()
      updatePermissions()
    },
    SOCKET_pendingOperations(state, payload) {
      state.pendingOperations.credentialStatusRegistry = []
      state.pendingOperations.pistisDIDRegistry = []
      payload.map(op => {
        let res = {}
        res.opId = op.opId;
        res.pendingInfo = op.opId //change it with actual pending info
        res.confirmationsCount = op.confirmationsCount
        res.alreadyConfirmed = false
        res.loading = true
        if (op.executor === state.contracts.pistisDIDRegistry) {
          state.pendingOperations.pistisDIDRegistry.push(res)
        } else if (op.executor === state.contracts.credentialStatusRegistry) {
          state.pendingOperations.credentialStatusRegistry.push(res)
        }
      })
      state.pendingOperations.mainOperationLoading = false
      setTimeout(() => {
        updateConfirmPendingOperations()
        state.pendingOperations.pistisDIDRegistry.map(op => op.loading = false)
        state.pendingOperations.credentialStatusRegistry.map(op => op.loading = false)
      }, 10000)
    },
    updatePendingOperations(state, payload) {
      let op = state.pendingOperations[payload.type].find(op => op.opId === payload.opId)
      if (payload.hasOwnProperty('result')) {
        op.alreadyConfirmed = payload.result
      }
      if (payload.hasOwnProperty('loading')) {
        op.loading = payload.loading
      }
    },
    updatePermissions(state, payload) {
      state.permission = payload
    },
    setMainOperationLoading(state, payload) {
      state.pendingOperations.mainOperationLoading = payload
    },
    setMinQuorum(state, payload) {
      state.minQuorum = payload
    },
    stopLoading(state, payload) {
      if (payload.type === 'mainOperationLoading') {
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
    pollWeb3({
      commit
    }, payload) {
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