<template>
  <v-flex>
    <v-toolbar flat color="white">
      <v-toolbar-title>Credential Management</v-toolbar-title>
    </v-toolbar>
    <v-expansion-panel v-model="panel" raised>
      <v-expansion-panel-content v-for="(item, index) in credentialsToShow" :key="item.iat" lazy>
        <template v-slot:header>
          <div>
            <v-icon>note</v-icon> {{ item.csu.name }}
            <span style="float:right" color="primary font-weight-medium" pr-5> Issued {{timestampToAgo(item.iat)}}
            </span>
          </div>
        </template>
        <v-card>
          <v-card-text class="grey lighten-3">
            <core-vc-displayer :open="panel == index" revokeBtn statusBtn :vc="item" />
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <br/>
    <core-pending-operations :contractType="'credentialStatusRegistry'" />
  </v-flex>
</template>

<script>
  export default {
    data: () => ({
      panel: null
    }),
    methods: {
      timestampToAgo: function (timestamp) {
        let current = new Date().getTime()
        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;
        var elapsed = current - timestamp;
        if (elapsed < msPerMinute) {
          return Math.round(elapsed / 1000) + ' seconds ago';
        } else if (elapsed < msPerHour) {
          return Math.round(elapsed / msPerMinute) + ' minutes ago';
        } else if (elapsed < msPerDay) {
          return Math.round(elapsed / msPerHour) + ' hours ago';
        } else if (elapsed < msPerMonth) {
          return 'approximately ' + Math.round(elapsed / msPerDay) + ' days ago';
        } else if (elapsed < msPerYear) {
          return 'approximately ' + Math.round(elapsed / msPerMonth) + ' months ago';
        } else {
          return 'approximately ' + Math.round(elapsed / msPerYear) + ' years ago';
        }
      }
    },
    computed: {
      credentialsToShow: function () {
        return this.$store.state.credentials
      }
    },
  }
</script>