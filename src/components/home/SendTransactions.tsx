import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import tokens from "../../configs/addresses.json";
import { useWeb3Context } from "../../context/Web3Context";
import useBEP20Contract from "../../hooks/useBEP20Contract";
import styles from "../../styles/home/sendTransaction.module.scss";
import { Connection } from "../../types";

export default function SendTransactions(): JSX.Element {
  const { isConnected, account } = useWeb3Context() as Connection;
  const [token, setTokenAddress] = useState<number>(0);
  const { balance, transfer, loading, setToken } = useBEP20Contract(tokens[0]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const form = e.currentTarget;
      const address = form.address.value;
      const value = form.amount.value;
      const transactionHash = await transfer(address, value);
      toast.success(`Initiated! Transaction Hash: ${transactionHash}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleTokenChange = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const token = e.target.value;
      setTokenAddress(parseInt(token));
      setToken(() => {
        const token = tokens.find((t) => t.address === e.target.value);
        if (token) {
          return token;
        } else {
          throw new Error("Invalid Token Address");
        }
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (account) {
      const token = tokens.find((t) => BigInt(t.chainId) === account.chainId);
      if (token) {
        if (Array.isArray(token)) {
          setTokenAddress(0);
          setToken(token[0]);
        } else {
          setTokenAddress(tokens.indexOf(token));
          setToken(token);
        }
      }

      return () => {
        setTokenAddress(0);
        setToken(tokens[0]);
      };
    }
  }, [account, setToken]);

  return (
    <div className={styles.send_transaction}>
      {isConnected && account ? (
        <>
          <h2>Send Transaction</h2>
          <p>Connected with {account.address}</p>
          <form onSubmit={handleSubmit}>
            <div className={styles.radio_input_group}>
              <label htmlFor="token_*">Select Token</label>
              {tokens.map((t, index) => (
                <div>
                  <input
                    type="radio"
                    name="token"
                    id={"token_" + t.address}
                    value={index}
                    onChange={handleTokenChange}
                    checked={tokens[token].address === t.address}
                    disabled={account.chainId !== BigInt(t.chainId)}
                    required
                  />
                  <label htmlFor={"token_" + t.address}>
                    {t.symbol}
                    {account.chainId === BigInt(t.chainId) &&
                      tokens[token].address === t.address &&
                      " (" + balance + "ETH)"}
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
