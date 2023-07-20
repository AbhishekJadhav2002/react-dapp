import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useNetwork } from "wagmi";
import tokens from "../../configs/addresses.json";
import useBEP20Contract from "../../hooks/useBEP20Contract";
import styles from "../../styles/home/sendTransaction.module.scss";

export default function SendTransactions(): JSX.Element {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const [tokenAddress, setTokenAddress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const { tokenBalance, isBalanceLoading, transfer } = useBEP20Contract(
    tokens[tokenAddress]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      const form = e.currentTarget;
      const address = form.address.value;
      const value = form.amount.value;
      const tx = await transfer(address, value);
      toast.success(`Transaction sent: ${tx}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTokenChange = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const token = e.target.value;
      setTokenAddress(parseInt(token));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className={styles.send_transaction}>
      {isConnected ? (
        <>
          <h2>Send Transaction</h2>
          <p>Connected with {address}</p>
          <form onSubmit={handleSubmit}>
            <div className={styles.radio_input_group}>
              <label htmlFor="token_*">Select Token</label>
              {chain &&
                tokens.map((t, index) => (
                  <div>
                    <input
                      type="radio"
                      name="token"
                      id={"token_" + t.address}
                      value={index}
                      onChange={handleTokenChange}
                      checked={tokens[tokenAddress].address === t.address}
                      disabled={chain.id !== t.chainId}
                      required
                    />
                    <label htmlFor={"token_" + t.address}>
                      {t.symbol}
                      {tokens[tokenAddress].address === t.address &&
                        !isBalanceLoading && (
                          <span>{" (" + tokenBalance?.formatted + ")"}</span>
                        )}
                    </label>
                  </div>
                ))}
            </div>
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
              <label htmlFor="amount">Amount (in ethers)</label>
              <input
                type="decimal"
                name="amount"
                id="amount"
                min={0}
                placeholder="Enter Amount (in ethers)"
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </>
      ) : (
        <p>Please connect your wallet to send transactions.</p>
      )}
    </div>
  );
}
