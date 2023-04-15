import styles from "../../styles/NftModal.module.css";

export default function NftModal({openModal}) {

return (
    <div className={styles.darkBG}>
      <div className={styles.centered}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h5 className={styles.heading}></h5>
          </div>
          <button className={styles.closeBtn} onClick={() => openModal(false)}>
            close
          </button>
          <div className={styles.modalContent}>
          </div>
        </div>
    </div>
    </div>
    )
}