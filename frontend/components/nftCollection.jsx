import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

import styles from "../styles/NftGallery.module.css";
import NFTGallery from "./gallery/nftGallery";
import UserNFTGallery from "./gallery/userNftGallery";

import { BORED_APES_CONTRACT, DOODLES_CONTRACT } from "../helpers/constants";
import { MOON_BIRDS_CONTRACT } from "../helpers/constants";
import getCollectionData from "../pages/api/getCollectionData";

export default function NftCollection() {
    const { isConnected, isConnecting, account } = useAccount();
    const [isLoading, setIsloading] = useState(false);
    const [collectionAddress, setCollectionAddress] = useState();
    const [moonBirds, setMoonBirds] = useState({});
    const [boredApes, setBoredApes] = useState({});
    const [doodles, setDoodles] = useState({});

    const changeCollection = (e) => {
        setCollectionAddress(e.target.value);
    };

    useEffect(() => {
    const getCollections = async () => {
      const baRes = await getCollectionData(BORED_APES_CONTRACT);
      const mbRes = await getCollectionData(MOON_BIRDS_CONTRACT);
      const dRes = await getCollectionData(DOODLES_CONTRACT);
      setMoonBirds(mbRes);
      setBoredApes(baRes);
      setDoodles(dRes);
    }

    getCollections();
  }, []);

return (
    <div className={styles.nft_gallery_page}>
        <div className={styles.gallery_header}>
        <h1>Supported Tokens</h1>
        {(!isConnected && !isConnecting) && (
        <div className={styles.button_wrapper}>
            <button value={BORED_APES_CONTRACT} className={styles.collection_button} onClick={(e) => changeCollection(e)}>{boredApes.CollectionName}</button>
            <button value={MOON_BIRDS_CONTRACT} className={styles.collection_button} onClick={(e) => changeCollection(e)}>{moonBirds.CollectionName}</button>
            <button value={DOODLES_CONTRACT} className={styles.collection_button} onClick={(e) => changeCollection(e)}>{doodles.CollectionName}</button>
        </div>
        )}
    </div>

        {isLoading ? (
            <div className={styles.loading_box}>
            <p>Loading...</p>
            </div>
        ) : (
            <>{isConnected ? <UserNFTGallery setIsloading={setIsloading} /> : <NFTGallery setIsloading={setIsloading} collectionAddress={collectionAddress} boredApes={boredApes} moonBirds={moonBirds} doodles={doodles} />}</>
        )}
    </div>
    );
}