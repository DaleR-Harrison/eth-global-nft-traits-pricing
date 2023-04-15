import fs from "fs";
import { program } from "commander";
import { parseBalanceMap } from './src/parse-balance-map.js';
import { create as createIPFS } from "ipfs";

program.requiredOption(
    "-n, --collectionName <collectionName>"
);

program.parse(
    process.argv
);

const _collectionName = program.collectionName;

const pricingInfo = JSON.parse(
    fs.readFileSync(
        `templates/${_collectionName}-pricing.json`,
        {
            encoding: "utf8"
        }
    )
);

const _collectionAddress = pricingInfo["CollectionAddress"];

let traitInfo = JSON.parse(
    fs.readFileSync(
        `templates/${_collectionName}-sorting.json`,
        {
            encoding: 'utf8'
        }
    )
);

let pricedNFTs = {};

const traits = traitInfo["TraitTypes"];
const prices = pricingInfo["RelativePrices"];

for (const traitType in prices) {
    for (const trait in prices[traitType]) {
        pricedNFTs[trait] = {
            "Price": prices[traitType][trait],
            "Identifiers": traits[traitType][trait]
        }
    }
}

const allKeys = Object.keys(pricedNFTs);
const inputMap = allKeys.reduce((item, _data) => {

    const price = pricedNFTs[_data]["Price"];
    const tokenIds = pricedNFTs[_data]["Identifiers"];

    const tokenPrices = tokenIds.map((_tokenId) => (
        {
            tokenId: _tokenId,
            price: price
        }
    ));

    tokenPrices.map((_element) => {
        item[_element.tokenId] = {
            "percent": _element.price.FloorPercent,
            "ceiling": _element.price.MaximumPrice
        };
    });

    return item;
}, {});

const result = parseBalanceMap(
    inputMap,
    _collectionName,
    _collectionAddress
);

const filePath = `trees-output/${_collectionName}.json`;

const ipfsNode = await createIPFS();

fs.writeFile(
    filePath,
    JSON.stringify(
        result,
        null,
        4
    ),
    async (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`Saved merkle tree data to: ${filePath}`);
            console.log(`New Merkle Root: ${result["MerkleRoot"]}`);

            // Add the file to IPFS
            const fileContent = fs.readFileSync(filePath);
            const fileAdded = await ipfsNode.add({ path: filePath, content: fileContent });
            const fileCID = fileAdded.cid.toString();

            console.log(`File added to IPFS with CID: ${fileCID}`);
        }
    }
);
