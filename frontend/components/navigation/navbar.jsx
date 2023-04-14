import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "../../styles/Navbar.module.css";
export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <a href="/">
        <img className={styles.app_logo} src="/nft-traits-logo.png"></img>
      </a>
      <div className={styles.connect_button}>
      	<ConnectButton chainStatus='none' showBalance={false}></ConnectButton>
	  </div>
    </nav>
  );
}
