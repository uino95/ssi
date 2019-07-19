
import Web3 from 'web3'
import store from '../store'

let pollWeb3 = function () {
  let web3 = window.web3
  web3 = new Web3(web3.givenProvider)

  setInterval(() => {
    if (web3 && store.state.web3.web3Instance) {
      let currentAddresses = web3.eth.getAccounts()
      if (currentAddresses[0] !== store.state.web3.address) {
        store.dispatch('pollWeb3', currentAddresses[0])
      } 
    }
  }, 1000)
}

export default pollWeb3