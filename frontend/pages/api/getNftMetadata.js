import { Network, Alchemy } from "alchemy-sdk";

export default async function getNftMetadata(address, tokenId) {
	const settings = {
		apiKey: "eXIlr55_YfeFBlWHs4GVx2p-EW9I2Om3",
		network: Network.ETH_MAINNET,
	};

	const alchemy = new Alchemy(settings);

	try {
		const nfts = await alchemy.nft.getNftMetadata(address, tokenId, {});
        return { address: nfts.address, tokenId: nfts.tokenId, media: nfts.media };

	} catch (e) {
		console.warn(e);
	}
}
