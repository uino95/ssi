<template>
	<v-treeview :open="open" :items="items"  item-key="name" open-on-click>
	    <template v-slot:prepend="{ item, open }">
	        <v-icon v-if="!item.children">
	        </v-icon>
	    </template>
	</v-treeview>
</template>
<script>
export default {
	props: {
        obj: {
            type: Object,
            required: true,
        },
        objName:{
        	type: String,
        	required: true
        }
    },
    data: () => ({
    	open: []
    }),
    computed: {
    	items(){
    		return [{
    			name: this.objName,
    			children: this.getChildren(this.obj)
    		}]
    	}
    },
    methods:{
    	getChildren(obj){
    		var children = []
    		for(var key in obj){
    			var value = obj[key]
    			if(value instanceof Object){
    				children.push({
    					name: key,
    					children: this.getChildren(value)
    				})
    			} else {
    				children.push({
    					name: key + ': ' + value
    				})
    			}
    		}
    		return children
    	}
    }

}

</script>