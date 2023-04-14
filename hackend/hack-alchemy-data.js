import * as fs from 'fs';
import { program } from 'commander';
import { createAlchemyWeb3 } from "@alch/alchemy-web3";

// Imports the Alchemy SDK
import { Alchemy, Network } from "alchemy-sdk";

// Configures the Alchemy SDK
const config = {
    apiKey: "J3bTM7KLiYYwh8Ar_VBXuo-oLlGTx7od",
    network: Network.ETH_MAINNET
};

const alchemy = new Alchemy(
    config
);

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

const collectionData = await alchemy.nft.getContractMetadata(
    _collectionAddress
);

const collectionTokens = [];
const collectionSize = collectionData.totalSupply;

for (let tokenId = 0; tokenId <= collectionSize; tokenId++) {

    console.log(tokenId, `${_collectionName}`);

    const rawData = await web3.alchemy.getNftMetadata({
        contractAddress: _collectionAddress,
        tokenId: tokenId
    });

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

const result = {
    "CollectionName": _collectionName,
    "CollectionAddress": _collectionAddress,
    "CollectionTokens": collectionTokens,
    "GenerationTime": new Date().toISOString()
}

fs.writeFile(
    `data/${_collectionName}.json`,
    JSON.stringify(
        result,
        null,
        4
    ),
    (error) => {
    if (error) {
        console.log(error);
    }
});

