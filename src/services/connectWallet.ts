import { Providers } from "@/types";
import { ethers } from "ethers";
import Web3 from "web3";

const ConnectWallet = async (str: Providers): Promise<Web3 | ethers.BrowserProvider | Error> => {
  if (window.ethereum) {
    try {
      let provider: any;
      if (str === "ethers") {
        provider = new ethers.BrowserProvider(window.ethereum);
      } else if (str === "web3") {
        provider = new Web3(window.ethereum);
      }
      return provider;
    } catch (error) {
      console.error(error);
      throw new Error('User denied account access');
    }
  }
  else if (window.web3 && str === "web3") {
    const web3 = window.web3;
    console.log('Injected web3 detected.');
    return web3;
  } else
    throw new Error('No crypto wallet found. Please install MetaMask.');
}

export default ConnectWallet;