import { toast } from "react-toastify";
import useEthersWalletConnect from "../hooks/useEthersWalletConnect";
import styles from "../styles/navbar.module.scss";

export default function Navbar(): JSX.Element {
  const { isConnected, connect, account, error } =
    useEthersWalletConnect("ethers");

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
