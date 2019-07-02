import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        lastUpdate: '123455688',
        credentials: [
            {
                iat: '1562000791383',
                iss: '3984324',
                csu: {
                    name: 'Cred1'
                }
            },
            {
                iat: '1562000793343',
                iss: '3984324',
                csu: {
                    name: 'Cred2'
                }
            },
            {
                "iat": 1562077338339,
                "exp": 1,
                "sub": "did:ethr:0x45",
                "iss": "did:ethr:0x9fe146cd95b4ff6aa039bf075c889e6e47f8bd18",
                "csu": {
                    "context": "https://schema.org",
                    "name": "My Address",
                    "@type": "Place",
                    "address": {
                        "@type": "PostalAddress",
                        "streeAddress": "strada cà cornuta, 2"
                    }
                },
                "csl": {
                    "id": 0,
                    "type": "Pistis-CSL/v1.0"
                }
            }

        ]
    },
    mutations: {
        addVC(state, newVC) {
            state.credentials.push(newVC)
        }
    },
    actions: {

    }
})