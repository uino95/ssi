<template>
<div>
  <v-toolbar flat color="white">
    <v-toolbar-title>Trusted Contacts Management</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark class="mb-2" v-on="on">New Trusted Contanct</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field v-model="editedItem.did" label="DID"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="editedItem.ent" label="Entity"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="editedItem.src" label="Source"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-toolbar>
  <v-data-table :headers="headers" :items="tcl" class="elevation-1">
    <template v-slot:items="props">
      <td wrap>{{props.item.did?props.item.did:'-'}}</td>
      <td wrap class="text-xs-left">{{ props.item.ent?props.item.ent.name:'-' }}</td>
      <td wrap class="text-xs-left">{{props.item.src}}</td>
      <td class="justify-center layout px-0 mr-2">
        <v-icon color="information" class="mr-2" @click="editItem(props.item)">
          edit
        </v-icon>
        <v-icon color="error" @click="deleteItem(props.item)">
          delete
        </v-icon>
      </td>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>
</div>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
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
    ],
    tcl: [],
    editedIndex: -1,
    editedItem: {
      did: '-',
      ent: '-',
      src: '-'
    },
    defaultItem: {
      did: '-',
      ent: '-',
      src: '-'
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Trusted Contact' : 'Edit Trusted Contact'
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    }
  },

  created() {
    this.tcl = this.$store.state.tcl
  },

  methods: {
    editItem(item) {
      this.editedIndex = this.tcl.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      const index = this.tcl.indexOf(item)
      confirm('Are you sure you want to delete this Trusted Contact?') && this.tcl.splice(index, 1)
      this.$store.commit('ediTC', {
        tcl: this.tcl
      })
    },

    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.tcl[this.editedIndex], this.editedItem)
      } else {
        this.tcl.push(this.editedItem)
      }
      this.$store.commit('ediTC', {
        tcl: this.tcl
      })
      this.close()
    }
  }
}
</script>
