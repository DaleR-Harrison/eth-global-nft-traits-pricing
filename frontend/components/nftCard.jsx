import React, { useEffect, useState } from "react";
import { useContractRead } from "wagmi";

import getPricingData from "../pages/api/getPricingData";
import { PRICING_ORACLE_CONTRACT } from "../pages/constants";
import { default as PricingOracleAbi } from "../PricingOracleABI.json";
import NftModal from "../components/modal/nftModal";

import styles from "../styles/NftGallery.module.css";

export default function NftCard({ nft, collectionName }) {
  const [opened, openModal] = useState(false);
  const [nftData, setNftData] = useState({PricingData: {}});
  const name = collectionName ?? nft.title;

  const displayTraits = () => {

    const traits = [];
    const tokenTraits = nft.TokenTraits && Object.entries(nft.TokenTraits);

    tokenTraits && tokenTraits.forEach(([name, value]) => {
      traits.push(<span className={styles.traits}><b>{name}</b>: {value}</span>);
    })
    return traits;
  }

  useEffect(() => {

    const getNftPricing = async () => {
      const res = await getPricingData(name, nft.TokenId);
      console.log(res, 'res');
      setNftData(res);
    }

    console.log("hello");
    if (nftData && nftData.PricingData.proof == undefined) {
      getNftPricing();
    }
  }, [name]);

  console.log(name);
  console.log(nft.TokenId);

  const contractConfig = {
    address: PRICING_ORACLE_CONTRACT,
    abi: PricingOracleAbi 
  }

  const result = useContractRead({
      ...contractConfig,
      functionName: "getTokenPrice",
      args: [
        nftData && nftData.CollectionAddress,
        nftData && nftData.PricingData.tokenId,
        nftData && nftData.PricingData.index,
        nftData && nftData.PricingData.percent,
        nftData && nftData.PricingData.ceiling,
        nftData && nftData.PricingData.proof
      ],
      watch: false,
      enabled: nftData && nftData.PricingData.proof,
      onError: (err) => { console.error(err)}
    });

  // console.log("data", result);
  console.log("nftData", nftData);

  return (
    <>
      <div className={styles.card_container} onClick={() => openModal(true)}>
        {<div className={styles.image_container}>
          {nft.format == "mp4" ? (
            <video src={nft.media} controls>
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={nft.media}></img>
          )}
        </div>}
        <div className={styles.info_container}>
          <div className={styles.title_container}>
            <h3>{name} #{nft.TokenId || nft.tokenId}</h3>
          </div>
          <hr className={styles.separator} />
          <div className={styles.description_container}>
          {displayTraits()}
          </div>
        </div>
      </div>
      {opened && <NftModal openModal={openModal} />}
    </>
    );
  }