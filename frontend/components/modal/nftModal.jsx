import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "../../styles/NftModal.module.css";

export default function NftModal({openModal}) {

return (
    <div className={styles.modalWrapper}>
      <div className={styles.modal}>
          <button className={styles.closeBtn} onClick={() => openModal(false)}>
            <img src="/close.png" height="20" width="20" />
          </button>
          <div className={styles.content}>
            <span>Please connect your wallet</span>
            <ConnectButton />
          </div>
        </div>
    </div>
    )
}