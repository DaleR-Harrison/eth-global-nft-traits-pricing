import fs from 'fs';
import { program } from 'commander';

program.requiredOption(
    '-n, --collectionName <collectionName>'
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

console.log(pricedNFTs, 'pricedNFTs');
