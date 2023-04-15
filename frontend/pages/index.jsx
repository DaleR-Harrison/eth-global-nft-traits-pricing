import styles from "../styles/Home.module.css";
import NftCollection from "../components/nftCollection";

export default function Home() {

  return (
    <div>
      <main className={styles.main}>        
        <NftCollection />
        <br />
        <br />        
        <div>
          Note: <b>pre-approve spender contract: {" "}
            <a target="_blank" className={styles.link} href="https://etherscan.io/address/0xc4302A799D0b01e2b8CdE0FE3eae38869b6B92bB#nfttransfers">
              0xc4302A799D0b01e2b8CdE0FE3eae38869b6B92bB
            </a>
            {" "} (works with 
              <a target="_blank" className={styles.link} href="https://etherscan.io/token/0x8a90cab2b38dba80c64b7734e58ee1db38b8992e#writeContract">
                {" "}Doodles
              </a>
            )
          </b> 
        </div>          
      </main>
    </div>
  );
}
