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
							{{operation.pendingInfo}}
						</v-list-tile-content>
						<v-list-tile-action>
							<v-btn color=info v-on:click="confirm(operation.opId)">
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
import {confirmOperation} from '../utils/MultiSigOperations'
export default {
	data: () => ({

	}),
	props:{
		contractType: String
	},
	methods:{
		confirm: async function(opId){
			const accounts = await this.$store.state.web3.web3Instance().eth.getAccounts()
			//await confirmOperation(opId, accounts[0])

			this.$socket.emit('fetchPendingOperations', this.$store.contracts[this.contractType], (operations) => {
        /*update store with new pending operations*/
        console.log(operations)
			})
			
		}
	},
	computed:{
		operationsToShow: function(){
			return this.$store.state.pendingOperations[this.contractType]
		}
	},
	mounted(){
		console.log(this.$store.state.contracts[this.contractType])
		this.$socket.emit('fetchPendingOperations', this.$store.state.contracts[this.contractType], (operations) => {
        /*update store with new pending operations*/
        console.log(operations)
		})
	}
	
}
</script>
