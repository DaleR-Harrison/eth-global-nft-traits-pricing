import { useEffect, useState } from "react";
import styles from "../styles/NftGallery.module.css";
import { useAccount } from "wagmi";

export default function NFTGallery({}) {
  const [nfts, setNfts] = useState();
  const [pageKey, setPageKey] = useState();
  const [isLoading, setIsloading] = useState(false);
  // const { address, isConnected } = useAccount();
  const address = "0xdb5485C85Bd95f38f9def0cA85499eF67dC581c0";

  const changeCollection = (e) => {
    setNfts()
    setPageKey()
    setWalletOrCollectionAddress(address);
  };

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
      <div>
        <div className={styles.fetch_selector_container}>
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
                <p>No NFTs found for the selected address</p>
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
function NftCard({ nft }) {
  return (
    <div className={styles.card_container}>
      <div className={styles.image_container}>
        {nft.format == "mp4" ? (
          <video src={nft.media} controls>
            Your browser does not support the video tag.
          </video>
        ) : (
          <img src={nft.media}></img>
        )}
      </div>
      <div className={styles.info_container}>
        <div className={styles.title_container}>
          <h3>{nft.title}</h3>
        </div>
        <hr className={styles.separator} />
        <div className={styles.symbol_contract_container}>
          <div className={styles.symbol_container}>
            <p>{nft.symbol}</p>

            {nft.verified == "verified" ? (
              <img
                src={
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/2048px-Twitter_Verified_Badge.svg.png"
                }
                width="20px"
                height="20px"
              />
            ) : null}
          </div>
          <div className={styles.contract_container}>
            <p className={styles.contract_container}>
              {nft.contract?.slice(0, 6)}...
              {nft.contract?.slice(38)}
            </p>
            <img
              src={
                "https://etherscan.io/images/brandassets/etherscan-logo-circle.svg"
              }
              width="15px"
              height="15px"
            />
          </div>
        </div>

        <div className={styles.description_container}>
          <p>{nft.description}</p>
        </div>
      </div>
    </div>
  );
}
