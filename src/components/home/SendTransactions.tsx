import { useState } from "react";
import { toast } from "react-toastify";
import useEthersWalletConnect from "../../hooks/useEthersWalletConnect";
import { SendTransaction } from "../../services";
import styles from "../../styles/home/sendTransaction.module.scss";
import Web3 from "web3";

export default function SendTransactions(): JSX.Element {
  const { isConnected, account, provider } = useEthersWalletConnect("ethers");
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsSending(true);
      const form = e.currentTarget;
      const address = form.address.value;
      const value = form.amount.value;
      const transactionHash = await SendTransaction({
        from: account?.address as string,
        to: address,
        value,
      }, provider as Web3);
      toast.success(`Initiated! Transaction Hash: ${transactionHash}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.send_transaction}>
      {isConnected && account ? (
        <>
          <h2>Send Transaction</h2>
          <p>Connected with {account.address}</p>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="address">Address</label>
              <input
                type="text"
                name="address"
                id="address"
                placeholder="Enter Receiver Address"
                pattern="^0x[a-fA-F0-9]{40}$"
                required
              />
            </div>
            <div>
              <label htmlFor="amount">Amount (in gwei)</label>
              <input
                type="number"
                name="amount"
                id="amount"
                min={0}
                placeholder="Enter Amount (in gwei)"
                required
              />
            </div>
            <button type="submit" disabled={isSending}>
              {isSending ? "Sending..." : "Send"}
            </button>
          </form>
        </>
      ) : (
        <p>Please connect your wallet to send transactions.</p>
      )}
    </div>
  );
}
