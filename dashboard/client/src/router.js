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
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
