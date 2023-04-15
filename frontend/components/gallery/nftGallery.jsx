import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import styles from "../../styles/NftGallery.module.css"
import NftCard from "../nftCard"; 
import { BORED_APES_CONTRACT, MOON_BIRDS_CONTRACT } from "../../pages/constants.ts"
import { fetchCollectionNft } from "../helpers/fetchNft.js"

import {
  default as BoredApes
} from "../../../hackend/data/BoredApes.json";
import {
  default as MoonBirds
} from "../../../hackend/data/MoonBirds.json";

export default function NFTGallery({}) {
  const [nfts, setNfts] = useState();
  const [isLoading, setIsloading] = useState(false);
  const [collectionAddress, setCollectionAddress] = useState(BORED_APES_CONTRACT);
  const [collectionName, setCollectionName] = useState("BoredApes");

  const changeCollection = (e) => {
    setCollectionAddress(e.target.value);
  };

  useEffect(() => {
    fetchCollectionNft(collectionAddress, setCollectionName, setIsloading, setNfts);
  }, [collectionAddress]);

  return (
    <div className={styles.nft_gallery_page}>
      <div>
        <div className={styles.gallery_header}>
          <h1>Supported collections</h1>
          <div className={styles.button_wrapper}>
            <button value={BORED_APES_CONTRACT} className={styles.collection_button} onClick={(e) => changeCollection(e)}>{BoredApes.CollectionName}</button>
            <button value={MOON_BIRDS_CONTRACT} className={styles.collection_button} onClick={(e) => changeCollection(e)}>{MoonBirds.CollectionName}</button>
          </div>
        </div> 
      </div>

      {isLoading ? (
        <div className={styles.loading_box}>
          <p>Loading...</p>
        </div>
      ) : (
        <div className={styles.nft_gallery}>
          <div className={styles.nfts_display}>
            {nfts?.length ? (
              nfts.map((nft) => {
                return <NftCard key={nft.TokenId} nft={nft} name={collectionName}/>;
              })
            ) : (
              <div className={styles.loading_box}>
                <p>No NFTs found in this collection</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
