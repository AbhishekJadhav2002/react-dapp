import { SendTransactions, SwitchNetwork } from "../components";
import styles from "../styles/home/home.module.scss";

export default function Home(): JSX.Element {
  return (
    <main className={styles.main}>
      <SwitchNetwork />
      <SendTransactions />
    </main>
  );
}
