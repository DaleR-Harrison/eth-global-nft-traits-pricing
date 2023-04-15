import axios from "axios";

export default async function getCollectionData(collectionAddress) {
    const collectionDataUrl = `https://third-anvil-383802.de.r.appspot.com/getCollectionData/${collectionAddress}`

    try {
        const res = await axios.get(collectionDataUrl);
        return res.data;
    }
    catch (e) {
        console.warn(e);
    }
}