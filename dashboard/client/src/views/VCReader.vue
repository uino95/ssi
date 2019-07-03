<template>
<v-flex>
  <v-flex>
    <core-hosted-by-card title="Verifiable Credential Reader" />

  </v-flex>
  <v-flex>
    <v-stepper v-model="stepper" vertical>

      <v-stepper-step :complete="stepper > 1" step="1">
        Wait for QR
        <small>The server generates the share request</small>
      </v-stepper-step>
      <v-stepper-content step="1">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-stepper-content>

      <v-stepper-step :complete="stepper > 2" step="2">
        Scan QR
        <small>Scan the QR and share the VC to read</small>
      </v-stepper-step>
      <v-stepper-content step="2" justify-center>
        <core-qr-card v-if="qr.qr!=''" :image="qr.qr" :uri="qr.uri" type="Share Request" mt-1 />
        <v-btn color="primary" @click="stepper = 1">
          Reset
        </v-btn>
      </v-stepper-content>

      <v-stepper-step step="3">
        Read Shared VCs
        <small>The VC have been read and the content displayed</small>
      </v-stepper-step>
      <v-stepper-content step="3">
        <div v-for="vc in credentials">
          <core-vc-displayer :vc="vc" />
        </div>
        <v-btn color="primary" v-on:click="reset">
          Reset
        </v-btn>
      </v-stepper-content>

    </v-stepper>
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
    stepper: 0,
    credentials: []
  }),
  sockets: {
    vcreader_reqQR: function(data) {
      this.qr = data
      this.stepper = 2
    },
    authenticatedCredentials: function(credentials) {
      this.credentials = credentials
      this.stepper = 3
    }
  },
  methods: {
    reset: function() {
      this.stepper = 1
      // SEND QR to reset
    }
  },
  mounted(){
    this.$socket.emit('vcreader_request', {});
  }
}
</script>
