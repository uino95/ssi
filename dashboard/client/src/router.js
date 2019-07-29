import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/credentialsmanagement',
      name: 'credentialsmanagement',
      component: () => import('./views/CredentialsManagement.vue'),
      meta: {permissionRequired: 'statusRegMgmt'}
    },
    {
      path: '/delegatesmanagement',
      name: 'delegatesmanagement',
      component: () => import('./views/DelegatesManagement.vue'),
      meta: {permissionRequired: 'delegatesMgmt'}
    }
  ]
})
