import styles from "../styles/NftGallery.module.css"

export default function NftCard({ nft }) {
    return (
      <div className={styles.card_container}>
        <div className={styles.image_container}>
          {nft.format == "mp4" ? (
            <video src={nft.media} controls>
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={nft.media}></img>
          )}
        </div>
        <div className={styles.info_container}>
          <div className={styles.title_container}>
            <h3>{nft.title}</h3>
          </div>
          <hr className={styles.separator} />
          <div className={styles.description_container}>
            <p>{nft.description}</p>
          </div>
        </div>
      </div>
    );
  }
  