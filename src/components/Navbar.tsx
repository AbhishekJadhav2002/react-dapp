import { toast } from "react-toastify";
import { useWeb3Context } from "../context/Web3Context";
import styles from "../styles/navbar.module.scss";
import { Connection } from "../types";

export default function Navbar(): JSX.Element {
  const { isConnected, connect, account, error } =
    useWeb3Context() as Connection;

  const connectWalletHandler = async () => {
    if (isConnected) return;
    try {
      await connect();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message, { autoClose: false });
    }
  };

  if (error) {
    toast.error(error.message);
  }

  return (
    <nav className={styles.nav}>
      <h1>React DApp</h1>
      {isConnected && account ? (
        <button>
          <span>{`Connected: $${account.balance?.toString()}`}</span>
          <p>{account.address}</p>
        </button>
      ) : (
        <button onClick={connectWalletHandler}>Connect Wallet</button>
      )}
    </nav>
  );
}
