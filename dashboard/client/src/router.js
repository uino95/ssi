import Vue from 'vue'
import Router from 'vue-router'
import VCReader from './views/VCReader.vue'

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
    }
  ]
})
