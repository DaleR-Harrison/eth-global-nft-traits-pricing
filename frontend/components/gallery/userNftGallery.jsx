import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import styles from "../../styles/NftGallery.module.css";
import NftCard from "../nftCard";
import { fetchUserNft } from "../../helpers/fetchNft.js";
import { SUPPORTED_COLLECTIONS } from "../../helpers/constants";

export default function UserNFTGallery({setIsloading}) {

  const [nfts, setNfts] = useState();
  const { address } = useAccount();

  useEffect(() => {
    fetchUserNft(address, setNfts);
    setIsloading(false);
  }, [address]);

  return (
    <div className={styles.nft_gallery}>
        {nfts?.length ? (
          <div className={styles.nfts_display}>
          {nfts.map((nft) => {
            if (SUPPORTED_COLLECTIONS.includes(nft.contract) == false) {
              return null;
            }
            // console.log(nft, 'nft');
            return <NftCard key={nft.TokenId} nft={nft} collectionName={nft.collectionName} />;
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
