import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import styles from "../../styles/NftGallery.module.css"
import NftCard from "../nftCard"; 

export default function NFTGallery({}) {
  const [nfts, setNfts] = useState();
  const [pageKey, setPageKey] = useState();
  const [isLoading, setIsloading] = useState(false);
  const [collectionAddress, setCollectionAddress] = useState("0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e");

  const changeCollection = (e) => {
    setNfts();
    setPageKey();
    setCollectionAddress(e.target.value);
  };

  const fetchNFTs = async (pagekey) => {
    if (!pageKey) setIsloading(true);
    const endpoint = "/api/getNftsForCollection";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
          address: collectionAddress,
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
      <div>
        <div className={styles.gallery_header}>
          <h1>Supported collections</h1>
          <div className={styles.button_wrapper}>
            <button value="0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D" className={styles.collection_button} onClick={(e) => changeCollection(e)}>BoredApeYachtClub</button>
            <button value="0x23581767a106ae21c074b2276D25e5C3e136a68b" className={styles.collection_button} onClick={(e) => changeCollection(e)}>Moonbirds</button>
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
                return <NftCard key={nft.tokenId} nft={nft} />;
              })
            ) : (
              <div className={styles.loading_box}>
                <p>No NFTs found in this collection</p>
              </div>
            )}
          </div>
        </div>
      )}

      {pageKey && nfts?.length && (
        <div>
          <a
            className={styles.button_black}
            onClick={() => {
              fetchNFTs(pageKey);
            }}
          >
            Load more
          </a>
        </div>
      )}
    </div>
  );
}
