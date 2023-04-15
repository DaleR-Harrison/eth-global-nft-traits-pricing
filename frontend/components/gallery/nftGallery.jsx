import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import styles from "../../styles/NftGallery.module.css"
import NftCard from "../nftCard"; 

import {
  default as BoredApes
} from "../../../hackend/data/BoredApes.json";
import {
  default as MoonBirds
} from "../../../hackend/data/MoonBirds.json";

export default function NFTGallery({}) {
  const [nfts, setNfts] = useState();
  const [isLoading, setIsloading] = useState(false);
  const [collectionAddress, setCollectionAddress] = useState("0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D");
  const [collectionName, setCollectionName] = useState("BoredApes");

  const changeCollection = (e) => {
    setCollectionAddress(e.target.value);
  };

  const fetchNFTs = async () => {
    if (collectionAddress === BoredApes.CollectionAddress) {
      setNfts(BoredApes.CollectionTokens);
      setCollectionName(BoredApes.CollectionName);
    }
    else {
      setNfts(MoonBirds.CollectionTokens);
      setCollectionName(MoonBirds.CollectionName);
    }
    setIsloading(false);
  };

  useEffect(() => {
    fetchNFTs();
  }, [collectionAddress]);

  return (
    <div className={styles.nft_gallery_page}>
      <div>
        <div className={styles.gallery_header}>
          <h1>Supported collections</h1>
          <div className={styles.button_wrapper}>
            <button value="0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D" className={styles.collection_button} onClick={(e) => changeCollection(e)}>{BoredApes.CollectionName}</button>
            <button value="0x23581767a106ae21c074b2276D25e5C3e136a68b" className={styles.collection_button} onClick={(e) => changeCollection(e)}>{MoonBirds.CollectionName}</button>
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

      {nfts?.length && (
        <div>
          <a
            className={styles.button_black}
            onClick={() => {
              fetchNFTs();
            }}
          >
            Load more
          </a>
        </div>
      )}
    </div>
  );
}
