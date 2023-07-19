import { ethers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import abi from "../configs/abi/BEP20.json";
import { useWeb3Context } from "../context/Web3Context";
import { GetChain } from "../services";
import { Connection, TokenConfig } from "../types";

const useBEP20Contract = (_token: TokenConfig) => {
    const { signer, account, provider } = useWeb3Context() as Connection;
    const [token, setToken] = useState<TokenConfig>(_token);
    const [balance, setBalance] = useState<string>('0');
    const [loading, setLoading] = useState<boolean>(false);

    const transfer = async (to: string, value: string): Promise<string | Error> => {
        try {
            if (!contract) {
                throw new Error("Contract not found");
            }
            setLoading(true);
            const weiValue = ethers.parseEther(value);
            const tx = await (await contract.transfer(to, weiValue)).wait();
            setLoading(false);
            return tx.hash;
        } catch (error: any) {
            setLoading(false);
            throw new Error(error);
        }
    }

    const contract = useMemo(() => {
        try {
            if (!token.address) {
                throw new Error("Token address not found");
            }
            return new ethers.Contract(token.address, abi, signer)
        } catch (error: any) {
            throw new Error(error);
        }
    }, [token, signer])

    const getBalance = useCallback(async (address: string): Promise<bigint | Error> => {
        try {
            if (provider && account) {
                const chainId = await GetChain(provider);
                if (chainId && Number(chainId) !== token.chainId) {
                    console.log("ChainId mismatch");
                    throw new Error("ChainId mismatch");
                }
            }
            if (!contract) {
                throw new Error("Contract not found");
            }
            const balance = await contract.balanceOf(address);
            return balance;
        } catch (error: any) {
            throw error;
        }
    }, [contract, provider, account, token.chainId])

    useEffect(() => {
        try {
            if (token.address && account) {
                getBalance(token.address).then((balance) => {
                    setBalance(balance.toString());
                }).catch((error) => {
                    console.log(error);
                })
            }
        } catch (error: any) {
            console.log(error);
        }

        return () => {
            setBalance('0');
        }
    }, [account, getBalance, token.address]);

    return { setToken, contract, transfer, balance, getBalance, loading };
}

export default useBEP20Contract;