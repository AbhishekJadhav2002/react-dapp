import { ethers } from 'ethers';
import Web3 from 'web3';
import GetChain from './getChain';

const SwitchNetwork = async (chainId: bigint, provider: Web3 | ethers.BrowserProvider): Promise<BigInt | Error> => {
  try {
    if (window.ethereum) {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      const switchedChainId = await GetChain(provider);
      return switchedChainId;
    } else
      throw new Error('No crypto wallet found. Please install MetaMask.');
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      throw new Error("This network is not available in your metamask, please add it")
    }
    throw new Error("Failed to switch to the network")
  }
}

export default SwitchNetwork;