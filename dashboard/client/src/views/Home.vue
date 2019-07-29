<template>
  <v-flex>
    <v-flex>
      <v-layout mb-5 justify-center>
        <v-flex xs8>
          <v-card color="orange" class="white--text" raised>
            <v-layout row>
              <v-flex xs7>
                <v-card-title primary-title>
                  <div>
                    <div class="headline && text-truncate">Hey {{loggedInAccount}} </div>
                    <div class="headline"> Welcome!</div>
                    <div>This is a simple home for the Consensys Bootcamp 21019 project. Beware, this is actually part of a broader project about Self Sovereign Identity that I'm working on. I cut down few parts so that we can focus on the smart contracts and blockchain intercation here!
                    <br><br>
                    Please read the README carefully to fully understand what's going on. Hope you like it! :)

                    <br><br>
                    Andrea Taglia
                    </div>
                  </div>
                </v-card-title>
              </v-flex>
            </v-layout>
            <v-flex >
                <v-img
                  src="https://www.drupal.org/files/styles/grid-3/public/logo-full-h-blue_0.png?itok=WdArfgGF"
                  height="125px"
                  contain
                ></v-img>
              </v-flex>
            <v-divider light></v-divider>
            <v-icon color="orange darken-2">access_time</v-icon>
            29 July 2019
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-flex>
</template>
<script>
export default {
  computed: {
    loggedInAccount: function(){
      return this.$store.state.web3.address != null ? this.$store.state.web3.address : 'there!'
    }
  }
}
</script>

