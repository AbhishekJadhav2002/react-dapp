import Web3 from 'web3';

const SwitchNetwork = async (chainId: bigint): Promise<BigInt | Error> => {
  try {
    if (window.ethereum) {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      const web3 = new Web3(window.ethereum);
      const switchedChainId = await web3.eth.getChainId();
      return BigInt(switchedChainId);
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