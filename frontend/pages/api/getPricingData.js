import axios from "axios";

export default async function getPricingData({ tokenName, tokenId }) {
    const pricingDataUrl = `"https://third-anvil-383802.de.r.appspot.com/getPricingData/${tokenName}/${tokenId}"`

    try {
        const res = await axios.get(pricingDataUrl);
        return res.data;
    }
    catch (e) {
        console.warn(e);
    }
}