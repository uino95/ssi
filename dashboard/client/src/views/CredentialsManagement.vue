<template>
<v-flex>
  <v-flex>
    <v-expansion-panel raised>
      <v-expansion-panel-content v-for="item in credentialsToShow" :key="item.key" lazy>
        <template v-slot:header>
          <div>
            <v-icon>school</v-icon> {{ item.name }}
            <span style="float:right" color="primary" pr-5> Issued {{item.vc.iat}} </span>
          </div>
        </template>
        <v-card>
          <v-card-text class="grey lighten-3">
            {{item.vc.csu}}
            <br><br>
            <v-btn color="error">Revoke Credential</v-btn>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-flex>
</v-flex>
</template>

<script>
export default {
  data: () => ({
    credentials: [{
        key: 0,
        icon: 'local_activity',
        name: 'Person',
        vc: {
          iat: '1562000791383',
          iss: '3984324',
          csu: '{ewjfwljf weljfoiew}'
        },
      },
      {
        key: 1,
        icon: 'local_activity',
        name: 'Person2',
        vc: {
          iat: '1562000793343',
          iss: '3984324',
          csu: '{mbare: "ciao"}'
        },
      }
    ]
  }),
  methods: {
    timestampToAgo: function(timestamp) {
      let current = new Date().getTime()
      var msPerMinute = 60 * 1000;
      var msPerHour = msPerMinute * 60;
      var msPerDay = msPerHour * 24;
      var msPerMonth = msPerDay * 30;
      var msPerYear = msPerDay * 365;

      var elapsed = current - timestamp;
      console.log(timestamp)

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
    credentialsToShow: function() {
      this.credentials.map( (item) => {
        item.vc.iat = this.timestampToAgo(item.vc.iat)
      })
      return this.credentials
    }
  },
}
</script>
