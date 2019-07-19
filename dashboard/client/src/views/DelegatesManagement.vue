<template>
  <v-flex>
    <v-toolbar flat color="white">
      <v-toolbar-title>Delegates Management</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-dialog v-model="showDialog" width="500">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" color="info">Add Delegate</v-btn>
        </template>
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>
            Add Delegate
          </v-card-title>
          <v-layout ma-3>
            <v-form>
              <v-flex>
                <v-select required v-model="typeToSet" :items="delegateType" label="Select a Type"></v-select>
                <v-text-field v-model="delegateToSet" label="Input The address of the delegate you want to add"
                  required></v-text-field>
              </v-flex>
            </v-form>
          </v-layout>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue" flat v-on:click="add">
              Add
            </v-btn>
            <v-btn color="red" flat v-on:click="reset">
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-expansion-panel raised>
      <v-expansion-panel-content v-for="item in delegateType" :key="item" lazy>
        <template v-slot:header>
          <div>
            <v-icon>note</v-icon> {{ mapTypeToName(item) }}
          </div>
        </template>
        <v-card>
          <v-card-text class="grey lighten-3">
            <v-list>
              <v-list-tile v-for="delegate in delegatesToShow[item]" :key="delegate">
                <v-list-tile-content>
                  {{delegate}}
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn color=error v-on:click="revoke(delegate)">
                    Revoke
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <br/>
    <core-pending-operations :contractType="'pistisDIDRegistry'" />
  </v-flex>
</template>

<script>
  import {
    submitAddDelegate,
    submitRevokeDelegate
  } from '../utils/MultiSigOperations'
  import {
    parseDIDDOcumentForDelegates
  } from '../utils/parseDID'
  export default {
    data: () => ({
      delegateType: ['authentication', 'statusRegMgmt', 'tcmMgmt'],
      showDialog: false,
      typeToSet: null,
      delegateToSet: null
    }),
    methods: {
      timestampToAgo: function (timestamp) {
        let current = new Date().getTime()
        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;
        var elapsed = current - timestamp;
        if (elapsed < msPerMinute) {
          return Math.round(elapsed / 1000) + ' seconds ago';
        } else if (elapsed < msPerHour) {
          return Math.round(elapsed / msPerMinute) + ' minutes ago';
        } else if (elapsed < msPerDay) {
          return Math.round(elapsed / msPerHour) + ' hours ago';
        } else if (elapsed < msPerMonth) {
          return 'approximately ' + Math.round(elapsed / msPerDay) + ' days ago';
        } else if (elapsed < msPerYear) {
          return 'approximately ' + Math.round(elapsed / msPerMonth) + ' months ago';
        } else {
          return 'approximately ' + Math.round(elapsed / msPerYear) + ' years ago';
        }
      },

      mapTypeToName: function (type) {
        switch (type) {
          case 'authentication':
            return 'Identity Management';
          case 'statusRegMgmt':
            return 'Credential Status Management';
          case 'tcmMgmt':
            return 'TCM Management';
          default:
            return 'no matching name'
        }
      },

      mapTypeToContract: function (type) {
        switch (type) {
          case 'authentication':
            return 'pistisDIDRegistry';
          case 'statusRegMgmt':
            return 'credentialStatusRegistry';
          case 'tcmMgmt':
            return 'TCM';
          default:
            return 'no matching contract'
        }
      },

      revoke: async function (delegateToRevoke) {
        const result = await this.$store.state.web3.web3Instance().eth.getAccounts()
        submitRevokeDelegate({
          identity: this.$store.state.identity,
          permission: this.$store.state.contracts[this.mapTypeToContract(this
          .typeToSet)], // select the correct smart contract depending on the typeToSet, 
          delegate: delegateToRevoke,
          from: result[0]
        })
      },

      add: async function () {
        const result = await this.$store.state.web3.web3Instance().eth.getAccounts()
        console.log(result)
        submitAddDelegate({
          identity: this.$store.state.identity,
          permission: this.$store.state.contracts[this.mapTypeToContract(this
          .typeToSet)], // select the correct smart contract depending on the typeToSet, 
          delegate: this.delegateToSet,
          from: result[0]
        })
        this.$socket.emit('fetchDIDDocument', (doc) => {
          /*update store with new delegates*/
          const delegates = parseDIDDOcumentForDelegates(doc)
          this.$store.commit('updateDelegates', delegates)
        })
        this.reset()
      },

      reset: function () {
        this.showDialog = false;
        this.typeToSet = null;
      }
    },
    computed: {
      delegatesToShow: function () {
        return this.$store.state.delegates
      }
    },
  }
</script>