<style scoped>
.cardContent {
    max-height: 600px;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>
<template>
    <v-flex v-if="qr !== null">
        <core-qr-card v-if="qr.qr!=''" :image="qr.qr" :uri="qr.uri" type="Attestation" mt-1 />
        <v-btn color="primary" @click="qr = null">
          Reset
        </v-btn>
    </v-flex>
    <v-layout  v-else row wrap>
        <v-flex md6 pr-3>
            <v-card class="cardContent">
                <v-form>
                    <v-layout ma-3>
                        <v-flex xs12 sm6 md4 pr-3>
                            <v-menu  v-model="menu" :close-on-content-click="false" :nudge-right="40" lazy transition="scale-transition" offset-y full-width min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-model="date" label="Select expiry date" prepend-icon="event" readonly v-on="on"></v-text-field>
                                </template>
                                <v-date-picker v-model="date" no-title scrollable @input="menu = false"/>
                            </v-menu>
                        </v-flex>
                        <v-flex>
                            <v-text-field v-model="credential.sub" label="Target Subject" required></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-form>
                <v-sheet class="pa-3 primary lighten-2">
                    <v-text-field v-model="search" label="Search Type" dark flat solo-inverted hide-details clearable clear-icon="mdi-close-circle-outline"></v-text-field>
                    <v-checkbox v-model="caseSensitive" dark hide-details label="Case sensitive search"></v-checkbox>
                </v-sheet>
                <v-layout justify-space-between pa-3>
                    <v-flex>
                        <v-treeview item-key="@id" :active.sync="active" :items="items" :open.sync="open" activatable active-class="primary--text" class="grey lighten-5" open-on-click transition return-object :search="search" :filter="filter">
                            <template v-slot:prepend="{ item, active }">
                                <v-icon v-if="!item.children" :color="active ? 'primary' : ''">
                                </v-icon>
                            </template>
                        </v-treeview>
                    </v-flex>
                    <v-flex>
                        <v-scroll-y-transition mode="out-in">
                            <div v-if="!selected" class="title grey--text text--lighten-1 font-weight-light" style="align-self: center;">
                                Select a type
                            </div>
                            <v-card v-else :key="selected['@id']" class="pt-4 mx-auto" flat max-width="400">
                                <v-card-text>
                                    <h3 class="headline mb-2">
                                        {{ selected.name }}
                                    </h3>
                                    <v-divider></v-divider>
                                    <div class="blue--text subheading font-weight-bold">{{ selected.description }}</div>
                                </v-card-text>
                                <v-divider></v-divider>
                                <v-layout tag="v-card-text" text-xs-left wrap>
                                    <v-flex tag="strong" xs5 text-xs-right mr-3 mb-2>More info at:</v-flex>
                                    <v-flex>
                                        <a :href="`https://schema.org/${selected.name}`" target="_blank">{{ selected.name }}</a>
                                    </v-flex>
                                </v-layout>
                                <v-btn v-on:click="addType" color="info">Add as main type</v-btn>
                                <v-btn v-on:click="addObject" color="info">Add as sub property</v-btn>
                            </v-card>
                        </v-scroll-y-transition>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-flex>
        <v-flex md6>
            <core-vue-json-editor v-model="credential" :plus="false" height="600px" v-on:error="onError" />
        </v-flex>
        <v-btn v-on:click="genQr" color="info">generate Qr</v-btn>
    </v-layout>
</template>
<script>
export default {

    data: () => ({
        qr: null,
        date: new Date().toISOString().substr(0,10),
        menu: false,
        active: [],
        open: [],
        types: [],
        search: null,
        caseSensitive: false,
        credential: {
            iat: new Date().getTime(),
            exp: 1,
            sub: "did:ethr:0x45",
            iss: "did:ethr:0x9fe146cd95b4ff6aa039bf075c889e6e47f8bd18",
            csu: {
                context: "https://schema.org",
                name: "My new credential"
            },
            csl: {
                id: 0,
                type: "Pistis-CSL/v1.0"
            }
        }
    }),

    computed: {
        items() {
            return [{
                id: 'schema:Thing',
                name: 'Thing',
                children: this.types
            }]
        },
        selected() {
            return this.active[0]
        },
        filter() {
            return this.caseSensitive ?
                (item, search, textKey) => item[textKey].indexOf(search) > -1 :
                undefined
        }
    },
    watch:{
        date(value){
            this.credential.exp = new Date(value).getTime();
        }
    },
    sockets:{
        vcbuilder_vcQr: function(data){
            this.qr = data
        }
    },
    methods: {
        fetchItems(item) {
            return fetch('https://schema.org/docs/tree.jsonld')
                .then(res => res.json())
                .then(json => this.types = json.children)
                .catch(err => console.warn(err))
        },
        addType() {
            this.$set(this.credential.csu, '@type', this.active[0].name)
        },
        addObject() {
            this.$set(this.credential.csu, this.active[0].name, {
                '@type': "Insert here the type of the newly added field"
            })
        },
        onError() {
            console.log('error')
        },
        genQr: function (data) {
            // $socket is socket.io-client instance
            this.$socket.emit('vcbuilder_genQr', this.credential);
        }
    },
    mounted() {
        this.fetchItems()
    }
}
</script>