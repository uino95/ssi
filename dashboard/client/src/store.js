import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    lastUpdate: '123455688'
  },
  mutations: {
    toggleDrawer(state) {
      state.drawer = !state.drawer
    }
  },
  actions: {

  }
})
