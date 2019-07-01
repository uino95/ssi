<template>
<div class="about">
  <h1>VC Reader</h1>
  <br>
  {{qr || 'nothing yet'}}
  <br>
  <core-qr-card v-if="qr!=null" v-bind:image="qr.qr" v-bind:uri="qr.uri">
  </core-qr-card>
</div>
</template>

<script>
export default {
  data: () => ({
    qr: {
      qr: 'ciao',
      uri: 'mbareeeee'
    }
  }),
  sockets: {
    connect: function () {
      console.log('socket connected')
    },
    loginQr: function (data) {
      this.qr = data
      console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
    }
  }
}
</script>
