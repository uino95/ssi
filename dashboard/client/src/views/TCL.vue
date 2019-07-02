<template>
<v-flex>
  <v-flex>
    <core-hosted-by-card title="Trusted Contacts List" />
  </v-flex>
  <v-flex>
    <v-data-table :headers="headers" :items="this.$store.state.tcl" class="elevation-1">
      <template v-slot:items="props">
        <td wrap>{{props.item.did?props.item.did:'-'}}</td>
        <td wrap class="text-xs-left">{{ props.item.ent?props.item.ent.name:'-' }}</td>
        <td wrap class="text-xs-left">{{props.item.src}}</td>
      </template>
    </v-data-table>
  </v-flex>
</v-flex>
</template>

<script>
export default {
  data: () => ({
    headers: [{
        text: 'DID',
        align: 'left',
        sortable: true,
        value: 'did'
      },
      {
        text: 'Entity',
        value: 'ent',
        sortable: true
      },
      {
        text: 'Source',
        value: 'src',
        sortable: true
      }
    ]
  }),
  methods: {

  }
}
</script>
