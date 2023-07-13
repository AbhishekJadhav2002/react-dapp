import { useState } from "react";
import { toast } from "react-toastify";
import useWalletConnect from "../../hooks/useWalletConnect";
import { SendTransaction } from "../../services";
import styles from "../../styles/home/sendTransaction.module.scss";

export default function SendTransactions(): JSX.Element {
  const { isConnected, account } = useWalletConnect();
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
      });
      toast.success(`Initiated! Transaction Hash: ${transactionHash}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.send_transaction}>
      {isConnected && account && (
        <>
          <h2>Send Transaction</h2>
          <p>Connected with {account.address}</p>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="address">Address</label>
              <input type="text" name="address" id="address" required />
            </div>
            <div>
              <label htmlFor="amount">Amount</label>
              <input type="text" name="amount" id="amount" required />
            </div>
            <button type="submit" disabled={isSending}>
              {isSending ? "Sending..." : "Send"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
