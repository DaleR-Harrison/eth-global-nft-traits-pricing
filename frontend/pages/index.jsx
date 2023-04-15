import styles from "../styles/Home.module.css";
import NftCollection from "../components/nftCollection";

export default function Home() {

  return (
    <div>
      <main className={styles.main}>
        <NftCollection />
      </main>
    </div>
  );
}
