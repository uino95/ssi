
import Web3 from 'web3'
import store from '../store'
import updateInfoPerAccount from './updateInfoPerAccount';

let pollWeb3 = function () {
  let web3 = window.web3
  web3 = new Web3(Web3.givenProvider)
  ethereum.enable().then(
    setInterval(async() => {
      if (web3 && store.state.web3.web3Instance) {
        let currentsAddress = await web3.eth.getAccounts()
        let curAddrress = currentsAddress[0].toLowerCase()
        if (curAddrress !== store.state.web3.address) {
          store.dispatch('pollWeb3', curAddrress)
          updateInfoPerAccount()
        } 
      }
    }, 1000)
  )
}

export default pollWeb3