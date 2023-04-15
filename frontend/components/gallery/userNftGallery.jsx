import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import styles from "../../styles/NftGallery.module.css"
import NftCard from "../nftCard"; 

export default function UserNFTGallery({}) {
  const [nfts, setNfts] = useState();
  const [pageKey, setPageKey] = useState();
  const [isLoading, setIsloading] = useState(false);
  const { address } = useAccount();

  const fetchNFTs = async (pagekey) => {
    if (!pageKey) setIsloading(true);
    const endpoint = "/api/getNftsForOwner";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
          address: address,
          pageKey: pagekey ? pagekey : null,
          chain: "ETH_MAINNET",
          excludeFilter: false,
        }),
      }).then((res) => res.json());
      if (nfts?.length && pageKey) {
        setNfts((prevState) => [...prevState, ...res.nfts]);
      } else {
        setNfts();
        setNfts(res.nfts);
      }
      if (res.pageKey) {
        setPageKey(res.pageKey);
      } else {
        setPageKey();
      }
    } catch (e) {
      console.log(e);
    }

    setIsloading(false);
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  return (
    <div className={styles.nft_gallery_page}>
        <div className={styles.gallery_header}>
          <h1>User's collection</h1>
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
                return <NftCard key={nft.tokenId} nft={nft} />;
              })
            ) : (
              <div className={styles.loading_box}>
                <p>No NFTs found for this address</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
