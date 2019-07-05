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
        <v-list-tile-action>
          <v-chip v-if="mapNameToChips(name) === 'valid'" color="green" text-color="white">valid</v-chip>
          <v-chip v-else-if="mapNameToChips(name) !== null" color="red" text-color="white">{{mapNameToChips(name)}}</v-chip>
        </v-list-tile-action>
      </v-list-tile>
      <v-card v-else min-height=60px flat>
        <v-layout row>
          <v-icon class="card-icon">
            {{mapNameToIcon(name)}}
          </v-icon>
          <v-card-text style="padding:0">
            <v-card-sub-title pt-2>{{mapNameToExpandedName(name)}} </v-card-sub-title>
            <core-object-viewer :obj="value" :objName="value.name ? value.name : 'csl'" />
          </v-card-text>
          <v-card-actions style="padding-right: 20px">
            <v-chip v-if="mapNameToChips(name) === 'valid'" color="green" text-color="white">valid</v-chip>
            <v-chip v-else-if="mapNameToChips(name) !== null" color="red" text-color="white">{{mapNameToChips(name)}}</v-chip>
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
        <v-btn v-on="on" color="error">Revoke Credential</v-btn>
      </template>
      <v-card>
        <v-card-title class="headline grey lighten-2" :loading="checkingStatus" primary-title>
          Revoke Credential
        </v-card-title>
        <v-form>
          <v-layout ma-3>
            <v-flex>
              <v-select required v-model="statusToSet.status" :items="possibleStatus" label="Select a Status"></v-select>
              <v-text-field :rules="rules" :counter="max" v-model="statusToSet.reason" label="Input The Reason" required></v-text-field>
            </v-flex>
          </v-layout>
        </v-form>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" flat v-on:click="setStatus">
            Revoke
          </v-btn>
          <v-btn color="red" flat v-on:click="resetStatus">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn v-if="statusBtn" color="success" v-on:click="checkStatus" :loading="checkingStatus">Check Credential Status</v-btn>
    <v-alert v-if="statusBtn" :value="errorAlert" type="error" transition="scale-transition" dismissible>
      Something went wrong
    </v-alert>
  </div>
</v-flex>
</template>
<script>
export default {
  props: {
    vc: {
      type: Object,
      required: true,
    },
    revokeBtn: Boolean,
    statusBtn: Boolean
  },
  data: () => ({
    possibleStatus: ["VALID", "REVOKED", "SUSPENDED"],
    statusToSet: {
      status: null,
      reason: ''
    },
    max: 32,
    dialog: false,
    expStatus: null,
    issStatus: null,
    subStatus: null,
    credStatus: null,
    checkingStatus: false,
    errorAlert: false
  }),
  sockets: {
    vcDisplayer_checkVCStatus_reply: function(data) {
      this.checkingStatus = false
      console.log(data)
      if (data == null) {
        this.showError()
      } else {
        this.expStatus = data.exp
        this.issStatus = data.iss
        this.subStatus = data.sub
        this.credStatus = data.csl
      }
    }
  },
  computed: {
    rules() {
      const rules = []

      const rule = v => (v || '').length <= this.max || `A maximum of ${this.max} characters is allowed`

      rules.push(rule)
    }

  },
  methods: {
    showError() {
      this.erroAlert = true
      setTimeout(function() {
        this.errorAlert = false
      }, 3000);
    },
    mapNameToIcon: function(name) {
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
        default:
          return 'error_outline'
      }
    },
    mapNameToExpandedName: function(name) {
      switch (name) {
        case 'iat':
          return 'Issue Date'
          break;
        case 'iss':
          return 'Issuer'
          break;
        case 'csu':
          return 'Credential Subject'
          break
        default:
          return name
      }
    },
    mapNameToChips: function(name) {
      switch (name) {
        case 'iss':
          return this.issStatus
          break;
        case 'sub':
          return this.subStatus
          break;
        case 'exp':
          return this.expStatus
          break;
        case 'csl':
          return this.credStatus
          break;
        default:
          return null

      }
    },
    checkStatus: function() {
      this.checkingStatus = true
      setTimeout(function() {
        if (this.checkingStatus) {
          this.checkingStatus = false
        }
      }, 5000)
      this.$socket.emit('vcDisplayer_checkVCStatus', {
        vc: this.vc,
        tcl: this.$store.state.tcl
      })
    },
    setStatus: function() {
      this.dialog = false
      this.$socket.emit('vcDisplayer_setStatus', {
        credentialId: this.vc.csl.id,
        status: this.statusToSet.status,
        statusReason: this.statusToSet.reason
      })
    },
    resetStatus: function() {
      this.dialog = false;
      this.statusToSet.reason = '';
      this.statusToSet.status = null;
    }
  }
}
</script>
