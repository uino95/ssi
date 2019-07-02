import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    lastUpdate: '123455688',
    credentials: [
      {
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
      }
    ]
  },
  mutations: {
    addVC(state, newVC) {
      state.credentials.push(newVC)
    }
  },
  actions: {

  }
})
