import { BrowserProvider } from "ethers";
import Web3 from "web3";
import { Transaction } from "../types";

const SendTransaction = async (transaction: Transaction, provider: Web3 | BrowserProvider) => {
  try {
    if (!window.ethereum)
      throw new Error("No Ethereum wallet found. Please install MetaMask.");
    const web3 = new Web3(window.ethereum);
    const { from, to, value } = transaction;
    const weiValue = web3.utils.toWei(value as string, "gwei");
    const events = await web3.eth.sendTransaction({
      from: from as string,
      to: to as string,
      value: weiValue,
    });
    return events.transactionHash;
  } catch (error: any) {
    throw error;
  }
}

export default SendTransaction;