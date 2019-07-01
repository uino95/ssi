<template>
<v-flex>
  <v-flex>
    <core-hosted-by-card />
  </v-flex>
  <v-flex>
    LIST here
  </v-flex>
</v-flex>
</template>

<script>
export default {
  data: () => ({
    qr: {
      qr: '',
      uri: 'loading..'
    },
    stepper: 0
  }),
  sockets: {
    shareQr: function(data) {
      this.qr = data
      this.stepper = 2
    },
    emitVC: function(data) {
      this.stepper = 3
    }
  },
  methods: {
    reset: function() {
      this.stepper = 1
      // SEND QR to reset
    }
  }
}
</script>
