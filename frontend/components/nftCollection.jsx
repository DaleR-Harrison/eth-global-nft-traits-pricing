import { useState } from "react";
import { useAccount, useContract } from "wagmi";

import { PRICING_ORACLE_CONTRACT } from "../pages/constants";
import { default as PricingOracleAbi } from "../PricingOracleABI.json";

import styles from "../styles/NftGallery.module.css";
import NFTGallery from "./gallery/nftGallery";
import UserNFTGallery from "./gallery/userNftGallery";

import { BORED_APES_CONTRACT } from "../pages/constants";
import { MOON_BIRDS_CONTRACT } from "../pages/constants";

import {
    default as BoredApes
} from "../../hackend/data/BoredApes.json";
import {
    default as MoonBirds
} from "../../hackend/data/MoonBirds.json";

export default function NftCollection() {
    const { isConnected } = useAccount();
    const [isLoading, setIsloading] = useState(false);
    const [collectionAddress, setCollectionAddress] = useState(BORED_APES_CONTRACT);

    const changeCollection = (e) => {
        setCollectionAddress(e.target.value);
    };

    const contract = useContract({
        addressOrName: PRICING_ORACLE_CONTRACT,
        abi: PricingOracleAbi,
      })    

return (
    <div className={styles.nft_gallery_page}>
        <div className={styles.gallery_header}>

        {isConnected ? (
        <h1>User's collection</h1> ) : ( 
        <>
            <h1>Supported collections</h1>
            <div className={styles.button_wrapper}>
                <button value={BORED_APES_CONTRACT} className={styles.collection_button} onClick={(e) => changeCollection(e)}>{BoredApes.CollectionName}</button>
                <button value={MOON_BIRDS_CONTRACT} className={styles.collection_button} onClick={(e) => changeCollection(e)}>{MoonBirds.CollectionName}</button>
            </div>
        </>
        )}
    </div> 

        {isLoading ? (
            <div className={styles.loading_box}>
            <p>Loading...</p>
            </div>
        ) : (
            <>{isConnected ? <UserNFTGallery setIsloading={setIsloading} contract={contract} /> : <NFTGallery setIsloading={setIsloading} collectionAddress={collectionAddress} contract={contract} />}</>
        )}
    </div>
    );
}