<style scoped>
.cardContent {
    max-height: 600px;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>
<template>
    <v-expansion-panel xs8>
        <v-expansion-panel-content>
            <template v-slot:header>
                <div>Credential Info</div>
            </template>
            <v-form >
                <v-container>
                    <v-layout>
                        <v-flex xs12 md4>
                            <v-text-field v-model="credential.exp" label="Expiration Date" required></v-text-field>
                        </v-flex>
                        <v-flex xs12 md4>
                            <v-text-field v-model="credential.sub" label="Target Subject" required></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-form>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
            <template v-slot:header>
                <div>Credential Subject</div>
            </template>
            <v-card class="cardContent">
                <v-text-field v-model="search" label="Search Company Directory" dark flat solo-inverted hide-details clearable clear-icon="mdi-close-circle-outline"></v-text-field>
                <v-layout justify-space-between pa-3>
                    <v-flex xs5>
                        <v-treeview item-key="@id" :active.sync="active" :items="items" :open.sync="open" activatable active-class="primary--text" class="grey lighten-5" open-on-click transition return-object :search="search" :filter="filter">
                            <template v-slot:prepend="{ item, active }">
                                <v-icon v-if="!item.children" :color="active ? 'primary' : ''">
                                </v-icon>
                            </template>
                        </v-treeview>
                    </v-flex>
                    <v-flex xs3>
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
                                <v-btn v-on:click="addType" color="info">Add</v-btn>
                            </v-card>
                        </v-scroll-y-transition>
                    </v-flex>
                    <v-flex xs4>
                        <div v-if="credential.csu.length === 0" key="title" class="title font-weight-light grey--text pa-3 text-xs-center">
                            Selected types
                        </div>
                        <v-scroll-x-transition group hide-on-leave>
                            <v-chip v-on:click="removeType" v-for="(el, i) in credential.csu" :key="i" color="grey" dark small>
                                <v-icon left small>mdi-beer</v-icon>
                                {{ el.name }}
                            </v-chip>
                        </v-scroll-x-transition>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>
<script>
export default {
    data: () => ({
        active: [],
        open: [],
        types: [],
        search: null,
        caseSensitive: false,
        credential: {
        	iat: new Date().getTime(),
        	exp: 1,
        	sub: undefined,
        	iss: "did:ethr:0x9fe146cd95b4ff6aa039bf075c889e6e47f8bd18",
        	csu: {
        		context: "https://schema.org",
        		name: "My new credential",
        		'@type': undefined
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
    methods: {
        fetchItems(item) {
            return fetch('https://schema.org/docs/tree.jsonld')
                .then(res => res.json())
                .then(json => this.types = json.children)
                .catch(err => console.warn(err))
        },
        addType() {
            this.credential.csu.push(this.active[0])
        },
        removeType(item) {
            this.credential.csu = this.credential.csu.filter(el => el.name !== item.srcElement.innerText)
        }
    },
    mounted() {
        this.fetchItems()
    }
}
</script>