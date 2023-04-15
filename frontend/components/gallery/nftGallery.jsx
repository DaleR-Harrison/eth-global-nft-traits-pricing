import { useEffect, useState } from "react";

import styles from "../../styles/NftGallery.module.css"
import NftCard from "../nftCard"; 
import { fetchCollectionNft } from "../../helpers/fetchNft.js"

export default function NFTGallery(setIsloading, collectionAddress, contract) {
  const [nfts, setNfts] = useState();
  const [collectionName, setCollectionName] = useState("BoredApes");

  useEffect(() => {
    fetchCollectionNft(collectionAddress, setCollectionName, setNfts);
    setIsloading(false);
  }, [collectionAddress]);

  return (
    <div className={styles.nft_gallery}>
      <div className={styles.nfts_display}>
        {nfts?.length ? (
          nfts.map((nft) => {
            return <NftCard key={nft.TokenId} nft={nft} collectionName={collectionName} />;
          })
        ) : (
          <div className={styles.loading_box}>
            <p>No NFTs found in this collection</p>
          </div>
        )}
      </div>
    </div>
  );
}
