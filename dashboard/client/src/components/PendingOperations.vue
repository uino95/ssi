<template>
	<v-flex>
		<v-toolbar flat color="white">
			<v-toolbar-title>List of pending operations relative to {{contractType}}</v-toolbar-title>
		</v-toolbar>
		<v-card>
			<v-card-text class="grey lighten-3">
				<v-list>
					<v-list-tile v-if="operationsToShow.length === 0">
						<v-list-tile-content>
							No operations yet
						</v-list-tile-content>
					</v-list-tile>
					<v-list-tile v-for="(operation) in operationsToShow" :key="operation.opId">
						<v-list-tile-content>
							<div> operation id: <b> {{operation.pendingInfo}} </b> </div>
						</v-list-tile-content>
						<v-list-tile-action>
							<v-layout row wrap>
								<v-flex pr-3 pt-1>
									<div> confirmations needeed: <b> {{minQuorum - operation.confirmationsCount}}</b> </div>
								</v-flex>
								<v-btn :loading="operation.loading" v-if="operation.alreadyConfirmed" color=error
									v-on:click="revoke(operation)">
									Revoke confirmation
								</v-btn>
								<v-btn :loading="operation.loading" v-else color=info v-on:click="confirm(operation)">
									Confirm
								</v-btn>
							</v-layout>
						</v-list-tile-action>
						</v-list-tile>
				</v-list>
			</v-card-text>
		</v-card>
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
		confirmOperation,
		revokeConfirmation,
	} from '../utils/MultiSigOperations'
	export default {
		data: () => ({
			contractAddress: null,
			snackbar: false
		}),
		props: {
			contractType: String
		},
		methods: {
			confirm: async function (op) {
				if (this.$store.getters.hasPermission(this.$store.state.web3.address, this.mapContractToType(this
						.contractType))) {
					this.$store.commit('updatePendingOperations', {
						opId: op.opId,
						type: this.contractType,
						loading: true
					})
					await confirmOperation(op.opId, this.$store.state.web3.address, this.contractType)

				} else {
					this.snackbar = true
				}
			},
			revoke: async function (op) {
				if (this.$store.getters.hasPermission(this.$store.state.web3.address, this.mapContractToType(this
						.contractType))) {
					this.$store.commit('updatePendingOperations', {
						opId: op.opId,
						type: this.contractType,
						loading: true
					})
					await revokeConfirmation(op.opId, this.$store.state.web3.address, this.contractType)
				} else {
					this.snackbar = true
				}

			},
			mapContractToType: function (contract) {
				switch (contract) {
					case 'pistisDIDRegistry':
						return 'delegatesMgmt';
					case 'credentialStatusRegistry':
						return 'statusRegMgmt';
					default:
						return 'no matching contract'
				}
			},
		},
		computed: {
			operationsToShow: function () {
				return this.$store.state.pendingOperations[this.contractType]
			},
			minQuorum: function () {
				return this.$store.state.minQuorum[this.contractType]
			}
		}
	}
</script>