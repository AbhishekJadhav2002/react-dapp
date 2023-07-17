import { ethers } from "ethers";
import Web3 from "web3";

const GetBalance = async (provider: Web3 | ethers.BrowserProvider, account: string): Promise<BigInt | Error> => {
  try {
    if (provider instanceof Web3) {
      const balance = await provider.eth.getBalance(account);
      return BigInt(balance);
    } else if (provider instanceof ethers.BrowserProvider) {
      const balance = await provider.getBalance(account);
      return BigInt(balance);
    } else
      throw new Error("Invalid provider");
  } catch (error: any) {
    return error;
  }
}

export default GetBalance;