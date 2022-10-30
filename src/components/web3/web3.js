import Web3 from "web3";

let web3;
if (typeof window.ethereum !== "undefined") {
  // we are on the browser and metamask has injected web3 into the browser
  web3 = new Web3(window.ethereum);
} else {
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/dc54edebc0c3401c8c310c24128add70"
  );
  web3 = new Web3(provider);
}

export default web3;
