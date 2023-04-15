import {
    default as BoredApes
} from "../../../hackend/data/BoredApes.json";
import {
    default as MoonBirds
} from "../../../hackend/data/MoonBirds.json";

export async function fetchUserNft(address, setIsloading, setNfts) {
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

    setIsloading(false);
}

export async function fetchCollectionNft(collectionAddress, setCollectionName, setIsloading, setNfts) {    
    if (collectionAddress === BoredApes.CollectionAddress) {
        setNfts(BoredApes.CollectionTokens);
        setCollectionName(BoredApes.CollectionName);
    }
    else {
        setNfts(MoonBirds.CollectionTokens);
        setCollectionName(MoonBirds.CollectionName);
    }

    setIsloading(false);    
}
