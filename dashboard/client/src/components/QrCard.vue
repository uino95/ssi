<template>
<v-flex xs12>
  <v-card color="cyan darken-2" class="white--text">
    <v-layout>
      <v-flex xs5>
        <v-img :src="image" height="125px" contain></v-img>
      </v-flex>
      <v-flex xs7>
        <v-card-title primary-title>
          <div>
            <div class="headline">Supermodel</div>
            <div>URI: {{uri}}</div>
            <div>(2014)</div>
          </div>
        </v-card-title>
      </v-flex>
    </v-layout>
    <v-divider light></v-divider>
    <v-card-actions class="pa-3">
      Rate this album
      <v-spacer></v-spacer>
      <v-icon>star_border</v-icon>
      <v-icon>star_border</v-icon>
      <v-icon>star_border</v-icon>
      <v-icon>star_border</v-icon>
      <v-icon>star_border</v-icon>
    </v-card-actions>
  </v-card>
</v-flex>
</template>

<script>
data: () => ({

})
props: {
  image: String;
  uri: String
}
</script>
