<template>
<v-app id="keep">
  <v-navigation-drawer v-model="drawer" fixed clipped class="grey lighten-4" app>
    <v-list dense class="grey lighten-4">
      <template v-for="(item, i) in items">
        <v-layout v-if="item.heading" :key="i" row align-center>
          <v-flex xs6>
            <v-subheader v-if="item.heading">
              {{ item.heading }}
            </v-subheader>
          </v-flex>
        </v-layout>
        <v-divider v-else-if="item.divider" :key="i" dark class="my-3"></v-divider>
        <v-list-tile v-else :key="i" ripple replace :to="item.route">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="grey--text">
              {{ item.text }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </v-navigation-drawer>
  <v-toolbar color="amber" app absolute clipped-left>
    <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
    <span class="title ml-3 mr-5">Pistis&nbsp;<span class="font-weight-light">Dashboard</span></span>
    <v-spacer></v-spacer>
  </v-toolbar>
  <v-content>
    <v-container fluid class="grey lighten-4">
      <v-layout justify-center align-center>
          <transition name="fade">
            <router-view></router-view>
          </transition>
      </v-layout>
    </v-container>
  </v-content>
</v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
    items: [{
        icon: 'lightbulb_outline',
        text: 'About',
        route: '/about'
      },
      {
        icon: 'touch_app',
        text: 'Reminders',
        route: '/about'
      },
      {
        divider: true
      },
      {
        heading: 'Labels'
      },
      {
        icon: 'add',
        text: 'Create new label',
        route: '/about'
      },
      {
        divider: true
      },
      {
        icon: 'archive',
        text: 'VC Reader',
        route: '/vcreader'
      },
      {
        icon: 'delete',
        text: 'Trash',
        route: '/about'
      },
      {
        divider: true
      },
      {
        icon: 'settings',
        text: 'Settings',
        route: '/about'
      },
      {
        icon: 'chat_bubble',
        text: 'Trash',
        route: '/about'
      }
    ]
  })
}
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
</style>
