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
      <td wrap>{{props.item.did}}</td>
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
        value: 'ent'
      },
      {
        text: 'Source',
        value: 'src'
      }
    ],
    tcl: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0
    },
    defaultItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0
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
    this.initialize()
  },

  methods: {
    shortenString: function(str) {
      return str != null ? str.slice(0, 15) : '-'
    },
    initialize() {
      this.tcl = [{
          src: "this",
          did: "did:ethr:0x09e3e5a2bfb3acaf00a52b458ef119801be0fdaf",
          ent: {
            type: "Person",
            name: "Doctor Who",
            familyName: "Who",
            givenName: "Jake",
            affiliation: {
              type: "Hospital",
              name: "St. Luke's Hospital",
              address: {
                type: "Postal Address",
                streetAddress: "St. Lukes Square",
                addressLocality: "G'Mangia Pieta",
                addressRegion: "PTA",
                postalCode: "1010"
              }
            }
          }
        },
        {
          src: "this",
          did: "did:ethr:0xdko03aw0j76f894824rt2cdef7a2018dbe32md97",
          ent: {
            type: "Person",
            name: "Doctor Abela",
            familyName: "Mark",
            givenName: "Abela",
            affiliation: {
              type: "Hospital",
              name: "St. Luke's Hospital",
              address: {
                type: "Postal Address",
                streetAddress: "St. Lukes Square",
                addressLocality: "G'Mangia Pieta",
                addressRegion: "PTA",
                postalCode: "1010"
              }
            }
          }
        },
        {
          src: "this",
          did: "did:ethr:0xbc3ae59bc76f894822622cdef7a2018dbe353840",
          ent: {
            type: "MedicalOrganization",
            name: "MyHealth",
            url: "https://myhealth-ng.gov.mt/"
          }
        },
        {
          src: "this",
          did: "did:ethr:0xeee6f3258a5c92e4a6153a27e251312fe95a19ae",
          ent: {
            type: "Organization",
            name: "IdentityMalta",
            url: "https://identitymalta.com"
          }
        },
        {
          src: "https://www.myhealth-ng.gov.mt/trsuted-contacts-list",
          did: null,
          ent: null
        }
      ]
    },

    editItem(item) {
      this.editedIndex = this.tcl.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      const index = this.tcl.indexOf(item)
      confirm('Are you sure you want to delete this Trusted Contact?') && this.tcl.splice(index, 1)
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
      this.close()
    }
  }
}
</script>
