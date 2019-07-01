<template>
<v-layout>
  <v-flex xs12 sm6 offset-sm3>
    <v-card width="300" raised>
      <v-img v-bind:src="image">
      </v-img>
      <v-card-title>
        <span >This QR contains a <b>{{type}}</b></span><br>
        <v-btn color="orange" :href="uri">Click here if on mobile</v-btn>
      </v-card-title>
      <v-divider light></v-divider>
      <v-card-actions class="pa-3">
        <v-icon color="orange darken-2">access_time</v-icon> Sent x mins ago
      </v-card-actions>
    </v-card>
  </v-flex>
</v-layout>
</template>

<script>
export default {
  props: ['image', 'uri', 'type']
}
</script>
