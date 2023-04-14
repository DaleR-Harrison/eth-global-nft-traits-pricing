import fs from 'fs';
import { program } from 'commander';

program.requiredOption(
    '-n, --collectionName <collectionName>'
);

program.parse(
    process.argv
);

const _collectionName = program.collectionName;

const json = JSON.parse(
    fs.readFileSync(
        `data/${_collectionName}.json`,
        {
            encoding: 'utf8'
        }
    )
);

const allTraitTypes = [];
const collectionTokens = json["CollectionTokens"];

collectionTokens.map((token) => {
    Object.keys(token.TokenTraits).map((traitType) => {
        allTraitTypes.push(
            traitType
        );
    });
});

const traitsForType = {};

allTraitTypes.map((traitType) => {
    traitsForType[traitType] = [];
});

collectionTokens.map((token) => {
    Object.entries(token.TokenTraits).map((tokenTrait) => {
        traitsForType[tokenTrait[0]].push(
            tokenTrait[1]
        );
    });
});

console.log(allTraitTypes, 'allTraitTypes');
console.log(traitsForType, 'traitsForType');

const priceEntry = {};
const traitTokens = {};

allTraitTypes.map((traitType) => {

    traitTokens[traitType] = {};
    priceEntry[traitType] = {};

    const traitSet = traitsForType[
        traitType
    ];

    traitSet.map((trait) => {
        traitTokens[traitType][trait] = [];
        priceEntry[traitType][trait] = {
            "PricingPercent": "100"
        };
    });
});

console.log(priceEntry, 'priceEntry');
console.log(traitTokens, 'traitTokens');
