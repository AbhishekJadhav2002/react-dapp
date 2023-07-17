import { ethers } from "ethers";
import Web3 from "web3";

const GetChain = async (provider: Web3 | ethers.BrowserProvider): Promise<BigInt | Error> => {
  try {
    if (provider instanceof Web3) {
      const chainId = await provider.eth.getChainId();
      return BigInt(chainId);
    } else if (provider instanceof ethers.BrowserProvider) {
      const chainId = await provider.getNetwork();
      return BigInt(chainId.chainId);
    } else
      throw new Error("Invalid provider");
  } catch (error: any) {
    return error;
  }
}

export default GetChain;