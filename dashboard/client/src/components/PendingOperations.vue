<template>
	<v-flex>
		<v-toolbar flat color="white">
			<v-toolbar-title>List of pending operations relative to {{contractType}}</v-toolbar-title>
		</v-toolbar>
		<v-card>
			<v-card-text class="grey lighten-3">
				<v-list>
					<v-list-tile v-for="(operation, index) in operationsToShow" :key="operation.opId">
						<v-list-tile-content>
							<div> operation id: <b> {{operation.pendingInfo}} </b> </div>
						</v-list-tile-content>
						<v-list-tile-action>
							<v-layout row wrap >
								<v-flex pr-3 pt-1>
									<div > confirmations needeed: <b> {{minQuorum - operation.confirmationsCount}}</b> </div>
									</v-flex>
									<v-btn :loading="operation.loading" v-if="operation.alreadyConfirmed" color=error v-on:click="revoke(operation)">
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
	</v-flex>
</template>

<script>
	import {
		confirmOperation,
		getMinQuorum
	} from '../utils/MultiSigOperations'
import {updateOperation} from '../utils/updateInfoPerAccount';
	export default {
		data: () => ({
			contractAddress: null
		}),
		props: {
			contractType: String
		},
		methods: {
			confirm: async function (op) {
				await confirmOperation(op.opId, this.$store.state.web3.address)
				this.$store.commit('updatePendingOperations', {
					opId: op.opId,
					type: this.contractType,
					loading: true
				})
				updateOperation(op, this.contractType)
			},
			revoke: async function (op){
				this.$store.commit('updatePendingOperations', {
					opId: op.opId,
					type: this.contractType,
					loading: true
				})
				//TODO call the method to revoke confirmations
			}
		},
		computed: {
			operationsToShow: function () {
				return this.$store.state.pendingOperations[this.contractType]
			},
			minQuorum: function(){
				return this.$store.state.minQuorum[this.contractType]
			}
		},
		mounted() {
			//TODO 
			// getMinQuorum(this.contractType)
		}
	}
</script>