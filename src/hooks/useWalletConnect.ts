import { useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import { ConnectWallet } from "../services";
import { Account, Connection } from "../types";

export default function useWalletConnect(): Connection {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [account, setAccount] = useState<Account | undefined>();
  const [error, setError] = useState<Error | undefined>();

  const reset = (err?: Error) => {
    setIsConnected(false);
    setAccount(undefined);
    setError(err);
  }

  const connect = useCallback(async () => {
    try {
      const web3: Web3 | Error = await ConnectWallet();
      if (web3 instanceof Error) {
        reset(web3);
      } else {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        if (accounts && Array.isArray(accounts) && accounts.length === 0) {
          reset(new Error('No accounts found. Please connect to MetaMask.'));
        } else if (accounts && Array.isArray(accounts) && accounts.length > 0) {
          setAccount({ address: accounts[0] });
          setIsConnected(true);
          setError(undefined);
          return accounts[0];
        }
      }
    } catch (error: any) {
      reset(error);
    }
  }, [])

  const disconnect = () => {
    reset();
  }

  if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts: any) => {
      if (accounts.length === 0) {
        reset();
      } else if (accounts.length > 0) {
        setAccount({ ...account, address: accounts[0] });
      }
    })
    window.ethereum.on('chainChanged', async (chainId: any) => {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const balance = await web3.eth.getBalance(accounts[0] as string);
      setAccount({ ...account, balance: BigInt(balance), chainId: BigInt(chainId) });
    })
  }

  useEffect(() => {
    let web3: any;
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      web3.eth.getAccounts()
        .then(async () => {
          if (account) return;
          const address = await connect();
          const chainId = await web3.eth.getChainId();
          const balance = await web3.eth.getBalance(address);
          setAccount({ address, balance: BigInt(balance), chainId: BigInt(chainId) });
          setIsConnected(true);
        }).catch((err: Error) => {
          reset(err);
        })
    } else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
      web3.eth.getAccounts()
        .then(async () => {
          if (account) return;
          const address = await connect();
          const chainId = await web3.eth.getChainId();
          const balance = await web3.eth.getBalance(address);
          setAccount({ address, balance: BigInt(balance), chainId: BigInt(chainId) });
          setIsConnected(true);
        }).catch((err: Error) => {
          reset(err);
        })
    } else {
      web3 = undefined;
      reset(new Error('No crypto wallet found. Please install MetaMask.'));
    }
  }, [account, connect])

  return {
    connect,
    disconnect,
    isConnected,
    account,
    error,
  }
}