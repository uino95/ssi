import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import VueSocketIO from 'vue-socket.io'

Vue.use(new VueSocketIO({
    debug: true,
    connection: 'localhost:3000',
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    }
}))

Vue.config.productionTip = false

router.beforeEach((to, from, next) => { 
  if (to.matched.some(record => record.meta.permissionRequired)) { 
      // this route requires condition to be accessed
      // if not, redirect to home page. 
      if (!store.state.permission[to.meta.permissionRequired]) { 
          //check codition is false
          next({ path: '/'}) 
      } else { 
          //check codition is true
          next() 
      } 
  } else { 
      next() // make sure to always call next()! 
  } 
}) 

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

