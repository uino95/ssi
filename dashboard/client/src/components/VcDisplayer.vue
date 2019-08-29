<style scoped>
  .list-icon {
    padding-right: 20px;
  }

  .card-icon {
    padding-right: 20px;
    padding-left: 16px;
  }
</style>
<template>
  <v-flex>
    <v-list>
      <template v-for="(value, name, index) in vc">
        <v-list-tile v-if="name!='csu' && name!='csl'" avatar>
          <v-icon class="list-icon">
            {{mapNameToIcon(name)}}
          </v-icon>
          <v-list-tile-content>
            <v-list-tile-sub-title>{{mapNameToExpandedName(name)}}</v-list-tile-sub-title>
            <v-list-tile-title>{{value}}</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action v-if="vcStatus!=null">
            <v-chip outline :color="mapNameToChipColor(name)">{{mapNameToChipText(name)}}</v-chip>
          </v-list-tile-action>
        </v-list-tile>
        <v-card v-else min-height=60px flat>
          <v-layout row>
            <v-icon class="card-icon">
              {{mapNameToIcon(name)}}
            </v-icon>
            <v-card-text style="padding:0">
              <core-object-viewer :obj="value" :objName="value.name ? value.name : 'csl'" />
            </v-card-text>
            <v-card-actions v-if="vcStatus!=null" pd-3>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-chip v-on="on" outline :color="mapNameToChipColor(name)">{{mapNameToChipText(name)}}</v-chip>
                </template>
                <span> {{vcStatus.csl.statusReason}}</span>
              </v-tooltip>
            </v-card-actions>
          </v-layout>
        </v-card>
        <v-divider v-if="index != Object.keys(vc).length - 1"></v-divider>
      </template>
    </v-list>
    <br />
    <div>
      <v-dialog v-if="revokeBtn" v-model="dialog" width="500">
        <template v-slot:activator="{ on }">
          <v-btn :loading="revoking && clicked === vc.csl.id" v-on="on" color="error"> Set Credential Status</v-btn>
        </template>
        <v-card>
          <v-card-title class="headline grey lighten-2" :loading="checkingStatus" primary-title>
            Set Credential Status
          </v-card-title>
          <v-form>
            <v-layout ma-3>
              <v-flex>
                <v-select required v-model="statusToSet.status" :items="possibleStatus" label="Select a Status">
                </v-select>
                <v-text-field :rules="rules" :counter="max" v-model="statusToSet.reason" label="Input The Reason"
                  required></v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" flat v-on:click="setStatus">
              Set
            </v-btn>
            <v-btn color="blue" flat v-on:click="resetStatus">
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-btn v-if="statusBtn" color="success" v-on:click="checkStatus" :loading="checkingStatus">Check Credential Status
      </v-btn>
      <v-alert v-if="statusBtn" :value="errorAlert" type="error" transition="scale-transition" dismissible>
        Something went wrong
      </v-alert>
    </div>
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
    submitSetCredentialStatus
  } from '../utils/MultiSigOperations'
  export default {
    props: {
      vc: {
        type: Object,
        required: true,
      },
      revokeBtn: Boolean,
      statusBtn: Boolean,
      open: Boolean
    },
    data: () => ({
      possibleStatus: ["VALID", "REVOKED", "SUSPENDED"],
      statusToSet: {
        status: null,
        reason: ''
      },
      max: 32,
      dialog: false,
      vcStatus: null,
      checkingStatus: false,
      errorAlert: false,
      clicked: null,
      snackbar: false
    }),
    sockets: {
      vcDisplayer_checkVCStatus_reply: function (data) {
        this.checkingStatus = false
        console.log(data)
        if (data === null) {
          this.showError()
        } else {
          this.vcStatus = data
        }
      }
    },
    watch: {
      open: function () {
        this.vcStatus = null
      }
    },
    computed: {
      rules() {
        const rules = []

        const rule = v => (v || '').length <= this.max || `A maximum of ${this.max} characters is allowed`

        rules.push(rule)
      },
      revoking: function () {
        return this.$store.state.pendingOperations.mainOperationLoading
      }

    },
    methods: {
      showError() {
        this.erroAlert = true
        setTimeout(function () {
          this.errorAlert = false
        }, 3000);
      },
      mapNameToIcon: function (name) {
        switch (name) {
          case 'iat':
            return 'schedule'
            break;
          case 'iss':
            return 'gavel'
            break;
          case 'sub':
            return 'perm_identity'
            break;
          case 'exp':
            return 'timer_off'
            break;
          case 'csu':
            return ''
            break;
          default:
            return 'error_outline'
        }
      },
      mapNameToExpandedName: function (name) {
        switch (name) {
          case 'iat':
            return 'Issue Date'
          case 'iss':
            return 'Issuer'
          case 'csu':
            return 'Credential Subject'
          case 'csl':
            return 'Credential Status List'
          default:
            return name
        }
      },
      mapNameToChipColor: function (name) {
        let good = 'green'
        let bad = 'red'
        let mid = 'orange'
        switch (name) {
          case 'iss':
            return good
          case 'sub':
            return good
          case 'exp':
            return this.vcStatus.exp ? bad : good
          case 'csl':
            if (this.vcStatus.csl.status == 0) {
              return good
            } else if (this.vcStatus.csl.status == 1) {
              return bad
            } else {
              return mid
            }
            break
          default:
            return 'white'
        }
      },
      mapNameToChipText: function (name) {
        switch (name) {
          case 'iss':
            return 'valid'
          case 'sub':
            return 'valid'
          case 'exp':
            return this.vcStatus.exp ? 'expired' : 'valid'
          case 'csl':
            return this.possibleStatus[this.vcStatus.csl.status].toLowerCase()
          default:
            return ''
        }
      },
      convertStatus(status) {
        switch (status) {
          case "VALID":
            return 0;
            break;
          case "REVOKED":
            return 1;
            break;
          case "SUSPENDED":
            return 2;
            break;
          default:
            throw new Error("< " + status + " > it isn't a valid status")
        }
      },
      checkStatus: function () {
        this.checkingStatus = true
        setTimeout(function () {
          if (this.checkingStatus) {
            this.checkingStatus = false
          }
        }, 3000)
        this.$socket.emit('vcDisplayer_checkVCStatus', {
          vc: this.vc
        })
      },
      setStatus: async function () {
        if (this.$store.getters.hasPermission(this.$store.state.web3.address, 'statusRegMgmt')) {
          submitSetCredentialStatus({
            identity: this.$store.state.identity,
            credentialId: this.vc.csl.id,
            credentialStatus: this.convertStatus(this.statusToSet.status),
            statusReason: this.statusToSet.reason,
            from: this.$store.state.web3.address
          })
          this.clicked = this.vc.csl.id
          this.$store.commit('setMainOperationLoading', true)
          this.resetStatus()
        } else {
          this.snackbar = true
        }
      },
      resetStatus: function () {
        this.dialog = false;
        this.statusToSet.reason = '';
        this.statusToSet.status = null;
      }
    }
  }
</script>