import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import styles from "../../styles/NftGallery.module.css";
import NftCard from "../nftCard"; 
import { fetchUserNft } from "../../helpers/fetchNft.js";

export default function UserNFTGallery(setIsloading, contract) {
  const [nfts, setNfts] = useState();
  const { address } = useAccount();

  useEffect(() => {
    fetchUserNft(address, setNfts);
    setIsloading(false);
  }, [address]);

  return (
    <div className={styles.nft_gallery}>
      <div className={styles.nfts_display}>
        {nfts?.length ? (
          nfts.map((nft) => {
            return <NftCard key={nft.tokenId} nft={nft} />;
          })
        ) : (
          <div className={styles.loading_box}>
            <p>No NFTs found for this address</p>
          </div>
        )}
      </div>
    </div>
  );
}
