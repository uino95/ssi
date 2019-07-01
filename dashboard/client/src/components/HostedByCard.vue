<template>
<v-layout mb-5 justify-center>
  <v-flex xs8>
    <v-card color="orange" class="white--text" raised>
      <v-layout row>
        <v-flex xs7>
          <v-card-title primary-title>
            <div>
              <div class="headline">{{title || 'Untitled'}}</div>
              <div>Hosted by: Politecnico di Milano</div>
            </div>
          </v-card-title>
        </v-flex>
        <v-flex xs5>
          <v-img src="https://www.deib.polimi.it/images/logo_polimi.png" height="125px" contain></v-img>
        </v-flex>
      </v-layout>
      <v-divider light></v-divider>
      <v-icon color="orange darken-2">access_time</v-icon> Updated {{lastUpdate}} days ago
    </v-card>
  </v-flex>
</v-layout>
</template>

<script>
export default {
  computed: {
    lastUpdate: function () {
      return this.$store.state.lastUpdate
    }
  },
  props: ['title']
}
</script>
