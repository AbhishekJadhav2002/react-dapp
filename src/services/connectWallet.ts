import Web3 from "web3";

const ConnectWallet = async (): Promise<Web3 | Error> => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      return web3;
    } catch (error) {
      console.error(error);
      throw new Error('User denied account access');
    }
  }
  else if (window.web3) {
    const web3 = window.web3;
    console.log('Injected web3 detected.');
    return web3;
  } else
    throw new Error('No crypto wallet found. Please install MetaMask.');
}

export default ConnectWallet;