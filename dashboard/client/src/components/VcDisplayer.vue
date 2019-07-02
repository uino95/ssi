<style scoped>
.list-icon {
    padding-right: 20px;
}
</style>
<template>
    <v-flex>
        <v-list>
            <template v-for="(value, name, index) in vc">
                <v-list-tile avatar>
                    <v-icon class="list-icon">
                        {{mapNameToIcon(name)}}
                    </v-icon>
                    <v-list-tile-content>
                        <v-list-tile-sub-title>{{mapNameToExpandedName(name)}}</v-list-tile-sub-title>
                        <v-list-tile-title v-if="name!='csu'">{{value}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-divider v-if="index != Object.keys(vc).length - 1"></v-divider>
            </template>
        </v-list>
        <v-treeview  :open="open" :items="items" activatable item-key=name item-text=name open-on-click>
            <template v-slot:prepend="{ item, open }">
                <v-icon v-if="!item.children">
                </v-icon>
            </template>
        </v-treeview>
    </v-flex>
</template>
<script>
export default {
    props: {
        vc: {
            type: Object,
            required: true,
        }
    },
    data: () => ({
        vc_items: [],
        open: [],
        items: [{
            id: 1,
            name: 'csu',
            children: [{
                    id: 2,
                    'context': 'https://schema.org',
                },
                {
                    id: 3,
                    name: 'name',
                    children: [{
                        id: 301,
                        name: 'My address'
                    }]
                },
                {
                    id: 4,
                    name: '@type: Place'
                },
                {
                    id: 5,
                    name: 'address',
                    children: [{
                            id: 501,
                            name: '@type',
                            children: [{
                                id: 5001,
                                name: 'PostalAddress'
                            }]
                        },
                        {
                            id: 502,
                            name: 'streeAddress',
                            children: [{
                                id: 5002,
                                name: 'strada cà cornuta,2'
                            }]
                        }
                    ]
                }
            ]
        }],
    }),
    // computed:{
    //   items(){
    //     return [{
    //         name: 'csu',
    //         children: this.getChildren(this.vc.csu)
    //     }]
    //   }
    // },
    methods: {
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
        getChildren: function(csu) {
            var children;
            if (csu instanceof Object) {

            }
        }
    }
}
</script>