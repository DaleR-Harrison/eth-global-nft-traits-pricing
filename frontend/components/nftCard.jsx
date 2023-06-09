import React, { useEffect, useState } from "react";

import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";

import getPricingData from "../pages/api/getPricingData";
import { PRICING_ORACLE_CONTRACT } from "../helpers/constants";
import { SHOP_CONTRACT } from "../helpers/constants";
import { default as PricingOracleAbi } from "../PricingOracleABI.json";
import { default as NFTDealerABI } from "../NFTDealerABI.json";
import NftModal from "../components/modal/nftModal";
import { fetchNftMetadata } from "../helpers/fetchNft";

import styles from "../styles/NftGallery.module.css";
import { ethers } from "ethers";

export default function NftCard({ nft, collectionName, collectionAddress }) {
  const { isConnected } = useAccount();

  const [opened, openModal] = useState(false);
  const [nftData, setNftData] = useState({PricingData: {}});
  const name = collectionName ?? nft.title;
  const tokenId = nft.TokenId || nft.tokenId;

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
      const res = await getPricingData(name, nft.TokenId || nft.tokenId);
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

  const contractConfigShop = {
    address: SHOP_CONTRACT,
    abi: NFTDealerABI
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

    // console.log(result, 'result');
    // console.log(result.data.toString(), "RES");
    // console.log("nftData", nftData);

  const price = result && result.data && ethers.utils.formatEther(
    result.data.toString()
  );

  const { config, error } = usePrepareContractWrite({
    address: SHOP_CONTRACT,
    abi: [
      {
        name: 'borrowETH',
        type: 'function',
        stateMutability: 'nonpayable',
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_borrowAmount",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_collectionAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_tokenId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_merkleIndex",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_floorPercent",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_maximumPrice",
            "type": "uint256"
          },
          {
            "internalType": "bytes32[]",
            "name": "_proof",
            "type": "bytes32[]"
          }
        ],
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
      },
    ],
    functionName: 'borrowETH',
    args: [
      nftData && result && result.data && result.data.toString(),
      nftData && nftData.CollectionAddress,
      nftData && nftData.PricingData.tokenId,
      nftData && nftData.PricingData.index,
      nftData && nftData.PricingData.percent,
      nftData && nftData.PricingData.ceiling,
      nftData && nftData.PricingData.proof
    ],
  })

  console.log(config, 'config');
  console.log(error, 'error');
  const { write } = useContractWrite(config);

  const handleBorrow = () => {
    if (isConnected) {
      write?.();
    }
    else {
      openModal(true)
    };
  }

  // console.log(price && parseFloat(price).toFixed(3), 'price');

  useEffect(() => {
    const getNftMd = async () => {
      const res = await fetchNftMetadata(collectionAddress, nft.TokenId || nft.tokenId);
      console.log("nftmd", res);
    }
    getNftMd();
  },[])

  return (
    <>
      <div className={styles.card_container} onClick={handleBorrow}>
        {<div className={styles.image_container}>
          {nft.media ? 
            <img src={nft.media}></img> : 
            <>{name === "MoonBirds" ? <img src={`https://live---metadata-5covpqijaa-uc.a.run.app/images/${tokenId}`}></img> : <img src={`/${name}-${tokenId}.png`}></img>}</>
          }
        </div>}
        <div className={styles.info_container}>
          <div className={styles.title_container}>
            <h3>{name} #{nft.TokenId || nft.tokenId}</h3>
          </div>
          <hr className={styles.separator} />
          <div className={styles.description_container}>
          {displayTraits()}
          {
            result && (
              <>
                <div className={styles.borrow_button}>Borrow: {price && parseFloat(price).toFixed(3)} ETH</div>
              </>
            )
          }
          </div>
        </div>
      </div>
      {opened && <NftModal openModal={openModal} />}
    </>
    );
  }