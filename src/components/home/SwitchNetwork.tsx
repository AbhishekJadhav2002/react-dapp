import { toast } from "react-toastify";
import useEthersWalletConnect from "../../hooks/useEthersWalletConnect";
import styles from "../../styles/home/switchNetwork.module.scss";

export default function SwitchNetworks(): JSX.Element {
  const { isConnected, account, switchChain } =
    useEthersWalletConnect("ethers");

  const handleNetworkSwitch = async (chainId: number) => {
    try {
      const switchedChainId = await switchChain(BigInt(chainId));
      toast.success(`Switched to ${switchedChainId}`, { autoClose: 3000 });
    } catch (error: any) {
      toast.error(error.message, { autoClose: false });
    }
  };

  return (
    <div className={styles.switch_network}>
      {isConnected ? (
        <>
          <button
            onClick={() => handleNetworkSwitch(97)}
            disabled={account?.chainId === BigInt(97)}
          >
            BnB
          </button>
          <button
            onClick={() => handleNetworkSwitch(11155111)}
            disabled={account?.chainId === BigInt(11155111)}
          >
            Sepolia
          </button>
        </>
      ) : (
        <p>Not Connected</p>
      )}
    </div>
  );
}
