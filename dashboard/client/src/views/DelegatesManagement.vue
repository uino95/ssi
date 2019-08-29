<template>
  <v-flex>
    <v-toolbar flat color="white">
      <v-toolbar-title>Delegates Management</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-dialog v-model="showDialog" width="500">
        <template v-slot:activator="{ on }">
          <v-btn :loading="loading && (clicked === 'adding')" v-on="on" color="info">Add Delegate</v-btn>
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
              <v-list-tile v-if="delegatesToShow[item].length === 0">
                <v-list-tile-content>
                  No delegates yet
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile v-else v-for="delegate in delegatesToShow[item]" :key="delegate">
                <v-list-tile-content>
                  {{delegate}}
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn :loading="loading && (clicked === delegate)" color=error v-on:click="revoke(delegate, item)">
                    Revoke
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <br />
    <core-pending-operations :contractType="'pistisDIDRegistry'" />
    <v-snackbar v-model="snackbar" right>
      Use an account with the right permission
      <v-btn color="pink" flat @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
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
      delegateType: ['delegatesMgmt', 'statusRegMgmt'],
      showDialog: false,
      typeToSet: null,
      delegateToSet: null,
      clicked: null,
      snackbar: false
    }),
    methods: {

      mapTypeToName: function (type) {
        switch (type) {
          case 'delegatesMgmt':
            return 'Delegates Management';
          case 'statusRegMgmt':
            return 'Credential Status Management';
          default:
            return 'no matching name'
        }
      },

      mapTypeToContract: function (type) {
        switch (type) {
          case 'delegatesMgmt':
            return 'pistisDIDRegistry';
          case 'statusRegMgmt':
            return 'credentialStatusRegistry';
          default:
            return 'no matching contract'
        }
      },

      revoke: async function (delegateToRevoke, typeToRevoke) {
        if (this.$store.getters.hasPermission(this.$store.state.web3.address, 'delegatesMgmt')) {
          submitRevokeDelegate({
            identity: this.$store.state.identity,
            permission: this.$store.state.contracts[this.mapTypeToContract(
              typeToRevoke)], // select the correct smart contract depending on the typeToSet, 
            delegate: delegateToRevoke,
            from: this.$store.state.web3.address
          })
          this.clicked = delegateToRevoke
          this.reset()
        } else {
          this.snackbar = true
        }
      },

      add: async function () {
        if (this.$store.getters.hasPermission(this.$store.state.web3.address, 'delegatesMgmt')) {
          submitAddDelegate({
            identity: this.$store.state.identity,
            permission: this.$store.state.contracts[this.mapTypeToContract(this
              .typeToSet)], // select the correct smart contract depending on the typeToSet, 
            delegate: this.delegateToSet,
            from: this.$store.state.web3.address
          })
          this.clicked = 'adding'
          this.reset()
        } else {
          this.snackbar = true
        }
      },

      reset: function () {
        this.$store.commit('setMainOperationLoading', true)
        this.showDialog = false;
        this.typeToSet = null;
      }
    },
    computed: {
      delegatesToShow: function () {
        return this.$store.state.delegates
      },
      loading: function () {
        return this.$store.state.pendingOperations.mainOperationLoading
      }
    },
  }
</script>