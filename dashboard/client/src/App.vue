<template>
  <v-app id="keep">
    <v-navigation-drawer v-model="drawer" fixed clipped class="grey lighten-4 main_drawer" app>
      <v-list dense class="grey lighten-4">
        <template v-for="(item, i) in items">
          <v-layout v-if="item.heading" :key="i" row align-center>
            <v-flex xs6>
              <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-right">
              <v-btn small flat>{{loggedInAddress!=null?loggedInAddress.slice(0,8)+'..':'LOGIN'}}</v-btn>
            </v-flex>
          </v-layout>
          <v-divider v-else-if="item.divider" :key="i" dark class="my-3"></v-divider>
          <v-list-tile v-else-if="!item.adminLink || ((loggedInAddress!=null) && item.adminLink)" :key="i" ripple
            replace :to="item.route" >
            <v-list-tile-action>
              <v-icon :color="getPermission(item.permission)">{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="grey--text">{{ item.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="amber" app fixed clipped-left class="main_toolbar">
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <span class="title ml-3 mr-5">
        Pistis&nbsp;
        <span class="font-weight-light">Dashboard &nbsp;</span>
        <span class="font-italic & subheading">did:pistis:{{this.$store.state.identity}}</span>
      </span>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content class="grey lighten-4">
      <v-container fluid>
        <v-layout justify-center align-center>
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import updateInfoPerAccount from './utils/updateInfoPerAccount'
  export default {
    data: () => ({
      drawer: null,
      loggedIn: true,
      items: [{
          icon: 'pageview',
          text: 'Home',
          route: '/',
          adminLink: false,
          permission: null
        },
        {
          divider: true
        },
        {
          heading: 'Dashboard Control'
        },
        {
          icon: 'chrome_reader_mode',
          text: 'Credentials Management',
          route: '/credentialsmanagement',
          adminLink: true,
          permission: 'statusRegMgmt'
        },
        {
          icon: 'people',
          text: 'Delegates Management',
          route: '/delegatesmanagement',
          adminLink: true,
          permission: 'delegatesMgmt'
        }
      ]
    }),
    computed:{
      loggedInAddress: function(){
        return this.$store.state.web3.address
      }
    },
    methods: {
      getPermission: function(permission){
        if(permission == null){
          return 'undefined'
        }
        return this.$store.state.permission[permission] ? 'success' : 'error'
      }
    },
    created() {
      console.log('registerWeb3 Action dispatched')
      this.$store.dispatch('registerWeb3')
    },
  };
</script>

<style>
  #keep main .container {
    height: 660px;
  }

  .navigation-drawer__border {
    display: none;
  }

  .text {
    font-weight: 400;
  }

  a {
    text-decoration: none;
    color: red;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition-duration: 0.3s;
    transition-property: opacity;
    transition-timing-function: ease;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }

  .main_toolbar {
    z-index: 10;
  }

  .main_drawer {
    z-index: 11;
  }
</style>