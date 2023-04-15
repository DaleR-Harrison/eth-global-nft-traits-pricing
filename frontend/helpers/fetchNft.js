import { BORED_APES_CONTRACT, MOON_BIRDS_CONTRACT } from "../pages/constants";

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

export function fetchCollectionNft(collectionAddress, setCollectionName, setNfts, boredApes, moonBirds) { 

    if (collectionAddress === BORED_APES_CONTRACT && boredApes) {
        setNfts(boredApes.CollectionTokens);
        setCollectionName(boredApes.CollectionName);
    }
    if (collectionAddress === MOON_BIRDS_CONTRACT && moonBirds) {
        setNfts(moonBirds.CollectionTokens);
        setCollectionName(moonBirds.CollectionName);
    }
}
