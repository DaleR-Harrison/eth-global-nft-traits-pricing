import {
    default as BoredApes
} from "../../hackend/data/BoredApes.json";
import {
    default as MoonBirds
} from "../../hackend/data/MoonBirds.json";

export async function fetchUserNft(address, setNfts) {
    const endpoint = "/api/getNftsForOwner";

    try {
    const res = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
        address: address,
        pageKey: null,
        chain: "ETH_MAINNET",
        excludeFilter: false,
        }),
    }).then((res) => res.json());
        setNfts();
        setNfts(res.nfts);

    } catch (e) {
        console.log(e);
    }
}

export async function fetchCollectionNft(collectionAddress, setCollectionName, setNfts) {    
    if (collectionAddress === BoredApes.CollectionAddress) {
        setNfts(BoredApes.CollectionTokens);
        setCollectionName(BoredApes.CollectionName);
    }
    else {
        setNfts(MoonBirds.CollectionTokens);
        setCollectionName(MoonBirds.CollectionName);
    }
}