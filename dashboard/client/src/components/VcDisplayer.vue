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
        <v-btn v-if="revokeBtn" color="error">Revoke Credential</v-btn>
        <v-btn v-if="statusBtn" color="success" v-on:click="checkStatus">Check Credential Status</v-btn>
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
        expStatus: null,
        issStatus: null,
        subStatus: null,
        credStatus: null,
    }),
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
            this.expStatus = 'valid'
            this.issStatus = 'valid'
            this.subStatus = 'valid'
            this.credStatus = 'valid'
            // depending on props check
            // isRevoked 
            // if(props.sender) sender matches subject
            // check expiry date
            if (this.vc.exp < new Date().getTime()) {
                this.expStatus = 'expired'
            }
        }
    }
}
</script>