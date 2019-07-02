import Vue from 'vue'
import Router from 'vue-router'
import VCReader from './views/VCReader.vue'
import TCL from './views/TCL.vue'
import TCM from './views/TCM.vue'
import CredentialsManagement from './views/CredentialsManagement.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'vcreader',
      component: VCReader
    },
    {
      path: '/vcreader',
      name: 'vcreader',
      component: VCReader
    },
    {
      path: '/vcbuilder',
      name: 'vcbuilder',
      component: () => import('./views/VCBuilder.vue')
    },
    {
      path: '/tcm',
      name: 'tcm',
      component: () => import('./views/TCM.vue')
    },
    {
      path: '/tcl',
      name: 'tcl',
      component: () => import('./views/TCL.vue')
    },
    {
      path: '/credentialsmanagement',
      name: 'credentialsmanagement',
      component: () => import('./views/CredentialsManagement.vue')
    },
  ]
})
