import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/vcreader',
      name: 'vcreader',
      component: () => import('./views/VCReader.vue'),
    },
    {
      path: '/tcl',
      name: 'tcl',
      component: () => import('./views/TCL.vue'),
    },
    {
      path: '/tcm',
      name: 'tcm',
      component: () => import('./views/TCM.vue'),
      meta: {
        permissionRequired: 'tcmMgmt'
      }
    },
    {
      path: '/vcbuilder',
      name: 'vcbuilder',
      component: () => import('./views/VcBuilder.vue'),
      meta: {
        permissionRequired: 'statusRegMgmt'
      }
    },
    {
      path: '/credentialsmanagement',
      name: 'credentialsmanagement',
      component: () => import('./views/CredentialsManagement.vue'),
      meta: {
        permissionRequired: 'statusRegMgmt'
      }
    },
    {
      path: '/delegatesmanagement',
      name: 'delegatesmanagement',
      component: () => import('./views/DelegatesManagement.vue'),
      meta: {
        permissionRequired: 'delegatesMgmt'
      }
    }
  ]
})