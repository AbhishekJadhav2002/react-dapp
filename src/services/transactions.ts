import Web3 from "web3";
import { Transaction } from "../types";

const SendTransaction = async (transaction: Transaction) => {
    try {
        if (!window.ethereum)
            throw new Error("No Ethereum wallet found. Please install MetaMask.");
        const web3 = new Web3(window.ethereum);
        const events = web3.eth.sendTransaction({
            from: transaction.from as string,
            to: transaction.to as string,
            value: transaction.value as string,
        });
        const result = await new Promise((resolve, reject) => {
            events.on("transactionHash", (hash: string) => {
                resolve(hash);
            });
            events.on("error", (error: Error) => {
                reject(error);
            });
        });
        return result;
    } catch (error) {
        throw error;
    }
}

export default SendTransaction;