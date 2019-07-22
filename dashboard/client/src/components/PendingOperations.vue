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
							<span> opId: <b>{{operation.pendingInfo}}</b> </span>
							<v-spacer/>
							<span> confirmations count: <b>{{operation.confirmationsCount}} / 2 </b> </span>
						</v-list-tile-content>
						<v-list-tile-action>
							<v-btn v-if="operation.alreadyConfirmed" color=error v-on:click="revoke(operation.opId)">
								Revoke confirmation
							</v-btn>
							<v-btn v-else color=info v-on:click="confirm(operation)">
								Confirm
							</v-btn>
						</v-list-tile-action>
					</v-list-tile>
				</v-list>
			</v-card-text>
		</v-card>
	</v-flex>
</template>

<script>
	import {
		confirmOperation
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
				updateOperation(op, this.contractType)
			},
			revoke: async function (opId){
				console.log(opId)
				//TODO call the method to revoke confirmations
			}
		},
		computed: {
			operationsToShow: function () {
				return this.$store.state.pendingOperations[this.contractType]
			}
		}
	}
</script>