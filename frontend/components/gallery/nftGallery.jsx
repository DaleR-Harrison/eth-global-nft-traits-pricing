import { useEffect, useState } from "react";

import styles from "../../styles/NftGallery.module.css"
import NftCard from "../nftCard";
import { fetchCollectionNft } from "../../helpers/fetchNft.js"

export default function NFTGallery({setIsloading, collectionAddress, boredApes, moonBirds}) {
  const [nfts, setNfts] = useState();
  const [collectionName, setCollectionName] = useState("BoredApes");

  useEffect(() => {
    fetchCollectionNft(collectionAddress, setCollectionName, setNfts, boredApes, moonBirds);
    setIsloading(false);
  }, [collectionAddress]);

  return (
    <div className={styles.nft_gallery}>
        {nfts?.length ? (
          <div className={styles.nfts_display}>
          {nfts.map((nft) => {
            return <NftCard key={nft.TokenId} nft={nft} collectionName={collectionName} />;
          })}
          </div>
        ) : (
          <div className={styles.loading_box}>
            <p>No Data Found</p>
          </div>
        )}
    </div>
  );
}
