import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import Web3 from 'web3';
import { ConnectWallet, GetAccounts, GetBalance, GetChain, SwitchNetwork } from "../services";
import { Account, Connection, Providers } from "../types";

export default function useEthersWalletConnect(_library: Providers): Connection {
  const [library, setLibrary] = useState<Providers>(_library);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [account, setAccount] = useState<Account | undefined>();
  const [error, setError] = useState<Error | undefined>();
  const [provider, setProvider] = useState<ethers.BrowserProvider | Web3 | undefined>();

  const reset = (err?: Error) => {
    setIsConnected(false);
    setAccount(undefined);
    setError(err);
  }

  const connect = useCallback(async () => {
    try {
      const _provider = await ConnectWallet(library);
      if (_provider instanceof Error) {
        reset(_provider);
      } else {
        const accounts = await GetAccounts(_provider) as string[];
        const balance = await GetBalance(_provider, accounts[0]);
        const chainId = await GetChain(_provider);
        setProvider(_provider);
        setAccount({ address: accounts[0], balance: balance as bigint, chainId: chainId as bigint });
        setIsConnected(true);
        setError(undefined);
        return accounts[0];
      }
    } catch (error: any) {
      reset(error);
    }
  }, [library])

  const switchChain = async (chainId: bigint) => {
    try {
      const switchedChainId = await SwitchNetwork(chainId, provider as Web3 | ethers.BrowserProvider) as bigint;
      return switchedChainId;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  const disconnect = () => {
    reset();
  }

  const isWalletConnected = useCallback(async () => {
    try {
      if (account)
        return true;

      const accounts = await GetAccounts(provider as Web3 | ethers.BrowserProvider) as string[];
      if (accounts.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      return false;
    }
  }, [provider, account])

  useEffect(() => {
    try {
      if (typeof window.ethereum === 'undefined')
        throw new Error("No Ethereum wallet found. Please install MetaMask.");
      window.ethereum.on('accountsChanged', async (accounts: any) => {
        if (accounts.length === 0) {
          reset();
        } else if (accounts.length > 0) {
          const balance = await GetBalance(provider as Web3 | ethers.BrowserProvider, accounts[0]);
          setAccount({ ...account, address: accounts[0], balance: balance as bigint });
        }
      })

      window.ethereum.on('chainChanged', async (chainId: any) => {
        const balance = await GetBalance(provider as Web3 | ethers.BrowserProvider, account?.address as string);
        setAccount({ ...account, balance: balance as bigint, chainId: BigInt(chainId) });
      })

      return () => {
        window.ethereum.removeAllListeners();
      }
    } catch (error: any) {
      console.log(error);
      reset(error);
    }
  }, [provider, account])

  useEffect(() => {
    try {
      isWalletConnected().then(async (isConnected) => {
        if (isConnected && account) {
          const balance = await GetBalance(provider as Web3 | ethers.BrowserProvider, account.address as string) as bigint;
          setAccount({ ...account, balance });
          setIsConnected(true);
        } else {
          await connect();
        }
      })
    } catch (error: any) {
      reset(error);
    }
  }, [isWalletConnected, connect, account, provider])

  return {
    provider,
    account,
    connect,
    switchChain,
    disconnect,
    error,
    isConnected,
    setLibrary,
  }
}