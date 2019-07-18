import Web3 from "web3";

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
        const web3js = new Web3(Web3.givenProvider || null);
        ethereum.enable().then(
          resolve({
              web3 () {
                  return web3js
              }
          })
        )
    });
  });

export default getWeb3;
