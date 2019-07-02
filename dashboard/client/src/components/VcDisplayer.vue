<style scoped>
.list-icon {
    padding-right: 20px;
}
.card-icon {
    padding-right: 20px;
    padding-left: 20px; 
}
</style>
<template>
    <v-flex>
        <v-list>
            <template v-for="(value, name, index) in vc">
                <v-list-tile v-if= "name!='csu'" avatar>
                    <v-icon class="list-icon">
                        {{mapNameToIcon(name)}}
                    </v-icon>
                    <v-list-tile-content >
                        <v-list-tile-sub-title>{{mapNameToExpandedName(name)}}</v-list-tile-sub-title>
                        <v-list-tile-title>{{value}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-card v-else min-height=60px flat>
                    <v-layout row >
                        <v-icon class="card-icon" >
                          {{mapNameToIcon(name)}}
                        </v-icon>
                        <core-object-viewer :obj="value" :objName="value.name"/>
                    </v-layout>
                </v-card>
                <v-divider v-if="index != Object.keys(vc).length - 1"></v-divider>
            </template>
        </v-list>
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
    data: () => ({}),
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
    }
}
</script>