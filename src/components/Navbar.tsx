import { Web3Button } from "@web3modal/react";
import styles from "../styles/navbar.module.scss";

export default function Navbar(): JSX.Element {
  return (
    <nav className={styles.nav}>
      <h1>React DApp</h1>
      <span>
        <Web3Button icon="hide" balance="show" />
      </span>
    </nav>
  );
}
