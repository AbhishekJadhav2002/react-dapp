import { useEffect, useState } from "react";
import { useAccount, useBalance, useContract, useNetwork, useProvider, useSigner } from "wagmi";
import abi from "../configs/abi/BEP20.json";
import { TokenConfig } from "../types";
import { BEP20 } from "../types/contracts";
import { toWei } from "../utils/conversions";

const useBEP20Contract = (_token: TokenConfig) => {
  const [token, setToken] = useState<TokenConfig>(_token);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const provider = useProvider({ chainId: chain?.id });
  const { data } = useSigner();
  const { data: tokenBalance, isLoading: isBalanceLoading, isError: isBalanceError } = useBalance({
    address: address,
    token: token.address as any,
  });
  const contract = useContract({
    address: token.address,
    abi: abi,
    signerOrProvider: data,
  }) as BEP20;

  const getBalance = async (address: string) => {
    try {
      const balance = await contract?.balanceOf(address);
      return balance;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  const transfer = async (to: string, amount: string) => {
    try {
      const decimals = await contract?.decimals();
      const weiValue = toWei(amount, decimals);
      const tx = await contract?.transfer(to, weiValue, { gasLimit: token.gasLimit });
      await tx?.wait();
      return tx.hash;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  useEffect(() => {
    provider.getCode(token.address).then((code) => {
      if (code === "0x") {
        console.log("Invalid token address");
      }
      setToken(_token);
    }).catch((error) => {
      console.log(error);
    })
  }, [_token, provider, token.address])

  useEffect(() => {
    if (isBalanceError) {
      console.log("Error fetching balance");
    }
  }, [isBalanceError])

  return {
    setToken,
    tokenBalance,
    isBalanceLoading,
    contract,
    getBalance,
    transfer,
  };
}

export default useBEP20Contract;