import { ethers } from "ethers";
import Web3 from "web3";

const GetAccounts = async (provider: Web3 | ethers.BrowserProvider): Promise<string[] | Error> => {
    try {
        let accounts: string[] = [];
        if (provider instanceof Web3)
            accounts = await provider.eth.getAccounts();
        else if (provider instanceof ethers.BrowserProvider)
            accounts = await provider.send("eth_requestAccounts", []);
        else
            throw new Error('Invalid provider.');

        if (accounts && Array.isArray(accounts) && accounts.length === 0) {
            throw new Error('No accounts found. Please connect to MetaMask.');
        } else if (accounts && Array.isArray(accounts) && accounts.length > 0) {
            return accounts;
        } else
            throw new Error('Invalid accounts.');
    } catch (error) {
        throw error;
    }
}

export default GetAccounts;