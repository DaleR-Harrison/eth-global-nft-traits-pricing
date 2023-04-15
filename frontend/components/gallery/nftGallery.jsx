import { useEffect, useState } from "react";

import styles from "../../styles/NftGallery.module.css"
import NftCard from "../nftCard";
import { fetchCollectionNft } from "../../helpers/fetchNft.js"

import { BORED_APES_CONTRACT, MOON_BIRDS_CONTRACT } from "../../pages/constants";
import getCollectionData from "../../pages/api/getCollectionData";

export default function NFTGallery({setIsloading, collectionAddress}) {
  const [nfts, setNfts] = useState();
  const [collectionName, setCollectionName] = useState("BoredApes");
  const [moonBirds, setMoonBirds] = useState();
  const [boredApes, setBoredApes] = useState();

  useEffect(() => {
    const getCollections = async () => {
      const mbRes = await getCollectionData(BORED_APES_CONTRACT);
      const baRes = await getCollectionData(MOON_BIRDS_CONTRACT);
      setMoonBirds(mbRes);
      setBoredApes(baRes);
    }

    getCollections();
  });

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
