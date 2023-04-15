import { useState, useEffect } from "react";
import getPricingData from "../pages/api/getPricingData";

export default function getNftPrice(contract, tokenName, tokenId) {
    const [tokenPrice, setTokenPrice] = useState();
  
    useEffect(() => {
      if (!tokenName || !tokenId || !contract) {
        setTokenPrice(undefined);
        return;
      }
  
      const getPrice = async () => {
        const res = await getPricingData(tokenName, tokenId);
        
        const collectionAddress = res.CollectionAddress;
        const merkleIndex = res.PricingData.index;
        const floorPercent = res.PricingData.percent;
        const maximumPrice = res.PricingData.ceiling;
        const proof = res.PricingData.proof;

        const price = await contract.getTokenPrice(collectionAddress, tokenId, merkleIndex, floorPercent, maximumPrice, proof)
        setTokenPrice(price);
      };
  
      getPrice();
    }, [tokenId]);
  
    return tokenPrice;

}