import styles from "../../styles/NftModal.module.css";
import { ethers } from "ethers";
import { useContractWrite } from "wagmi";
import { SHOP_CONTRACT } from "../../helpers/constants";
import { default as NFTDealerABI } from "../../NFTDealerABI.json";

export default function NftModal({openModal, nftData, price}) {

  console.log(nftData, '2342');

  const contractConfigShop = {
    address: SHOP_CONTRACT,
    abi: NFTDealerABI
  }

  const contractWrite = useContractWrite({
    address: SHOP_CONTRACT,
    abi: contractConfigShop,
    functionName: "borrowETH",
    args: [
      nftData && nftData.CollectionAddress,
      nftData && nftData.PricingData.tokenId,
      nftData && nftData.PricingData.index,
      nftData && nftData.PricingData.percent,
      nftData && nftData.PricingData.ceiling,
      nftData && nftData.PricingData.proof
    ],
    overrides: {
      value: ethers.utils.parseEther(price),
    }
  });

  console.log(contractWrite, 'contractWrite');

return (
    <div className={styles.modalWrapper}>
      <div className={styles.modal}>
          <button className={styles.closeBtn} onClick={() => openModal(false)}>
            <img src="/close.png" height="20" width="20" />
          </button>
          <div className={styles.content}>
          </div>
        </div>
    </div>
    )
}