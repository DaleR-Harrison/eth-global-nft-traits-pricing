import { program } from 'commander';
import { createAlchemyWeb3 } from "@alch/alchemy-web3";

const web3 = createAlchemyWeb3(
    "https://eth-mainnet.g.alchemy.com/v2/J3bTM7KLiYYwh8Ar_VBXuo-oLlGTx7od",
);

program
    .requiredOption('-n, --collectionName <collectionName>')
    .requiredOption('-a, --collectionAddress <collectionAddress>');

program.parse(
    process.argv
);

const _collectionName = program.opts().collectionName;
const _collectionAddress = program.opts().collectionAddress;

const collectionTokens = [];

for (let tokenId = 0; tokenId <= 1; tokenId++) {

    console.log(tokenId, `${_collectionName}`);

    const rawData = await web3.alchemy.getNftMetadata({
        contractAddress: _collectionAddress,
        tokenId: tokenId
    });

    console.log(rawData, 'rawData');

    const initialToken = rawData["id"]["tokenId"];
    const rawAttribute = rawData["metadata"]["attributes"];
    const parsedTraits = {};

    rawAttribute.forEach((attribute) => {
        parsedTraits[
            attribute["trait_type"]
        ] = attribute["value"];
    });

    const tokenData = {
        "TokenId": initialToken,
        "TokenTraits": parsedTraits
    };

    console.log(
        tokenData,
        "tokenData"
    );

    collectionTokens.push(
        tokenData
    );
}
