import { BrowserProvider, ethers } from "ethers";
import abi from "../configs/abi/BEP20.json";
import { Transaction } from "../types";
import { BEP20 } from "../types/contracts";

const SendTransaction = async (transaction: Transaction, provider: BrowserProvider) => {
  try {
    if (!window.ethereum)
      throw new Error("No Ethereum wallet found. Please install MetaMask.");
    // const web3 = new Web3(window.ethereum);
    const signer = await provider.getSigner(0);
    const address = '0x64544969ed7EBf5f083679233325356EbE738930'
    const contract = new ethers.Contract(address, abi, signer) as unknown as BEP20;
    const { to, value } = transaction;
    const weiValue = ethers.parseUnits(value, "wei");
    const tx = await contract.transfer(to, weiValue);
    const receipt = await tx.wait();
    if (receipt == null)
      throw new Error("Transaction failed.");
    return receipt.hash;
  } catch (error: any) {
    throw error;
  }
}

export default SendTransaction;