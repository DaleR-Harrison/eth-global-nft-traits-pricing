import * as fs from "fs";
import { program } from "commander";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { Alchemy, Network } from "alchemy-sdk";

const apiKey = "J3bTM7KLiYYwh8Ar_VBXuo-oLlGTx7od";
const web3 = createAlchemyWeb3(
    `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`
);

const config = {
    apiKey: apiKey,
    network: Network.ETH_MAINNET
};

const alchemy = new Alchemy(
    config
);

program
    .requiredOption("-n, --collectionName <collectionName>")
    .requiredOption("-a, --collectionAddress <collectionAddress>");

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
        tokenId: tokenId // @TODO: see if can be converted to BN
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

