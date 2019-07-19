
import Web3 from 'web3'
import store from '../store'

let pollWeb3 = function () {
  let web3 = window.web3
  web3 = new Web3(Web3.givenProvider)
  ethereum.enable().then(
    setInterval(async() => {
      if (web3 && store.state.web3.web3Instance) {
        let currentsAddress = await web3.eth.getAccounts()
        if (currentsAddress[0] !== store.state.web3.address) {
          store.dispatch('pollWeb3', currentsAddress[0])
        } 
      }
    }, 1000)
  )
}

export default pollWeb3