import fs from "fs";
import { program } from "commander";
import { parseBalanceMap } from './src/parse-balance-map.js';

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
    inputMap
);

console.log(result, 'result');

fs.writeFile(
    `trees-output/${_collectionName}.json`,
    JSON.stringify(
        result,
        null,
        4
    ),
    (err) => {
        console.log(err);
    }
);
