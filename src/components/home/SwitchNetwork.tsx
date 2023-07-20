import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import styles from "../../styles/home/switchNetwork.module.scss";

export default function SwitchNetworks(): JSX.Element {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork({
    onError(error) {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }

    return () => {
      toast.dismiss();
    };
  }, [error]);

  return (
    <div className={styles.switch_network}>
      {isConnected && chain ? (
        <>
          <button
            onClick={() => switchNetwork?.(97)}
            disabled={!switchNetwork || chain?.id === 97}
          >
            BnB
            {isLoading && pendingChainId === 97 && " (switching)"}
          </button>
          <button
            onClick={() => switchNetwork?.(11155111)}
            disabled={!switchNetwork || chain?.id === 11155111}
          >
            Sepolia
            {isLoading && pendingChainId === 11155111 && " (switching)"}
          </button>
        </>
      ) : (
        <p>Not Connected</p>
      )}
    </div>
  );
}
