import styles from "../styles/Home.module.css";
import NFTGallery from "../components/gallery/nftGallery";
import UserNFTGallery from "../components/gallery/userNftGallery";

import { useAccount } from "wagmi";

export default function Home() {
  const {isConnected } = useAccount();

  return (
    <div>
      <main className={styles.main}>
        {isConnected ? <UserNFTGallery /> : <NFTGallery />}
      </main>
    </div>
  );
}
