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
            "FloorPercent": 100,
            "MaximumPrice": 1000
        }
    });
});

collectionTokens.map((token) => {
    Object.entries(token.TokenTraits).map((tokenTrait) => {
        const traitType = tokenTrait[0];
        const traitValue = tokenTrait[1];
        traitTokens[traitType][traitValue].push(
            token.TokenId
        );
    });
});

fs.writeFile(
    `templates/${_collectionName}-pricing.json`,
    JSON.stringify(
        priceEntry,
        null,
        4
    ),
    (error) => {
    if (error) {
        console.log(error);
    }
});

fs.writeFile(
    `templates/${_collectionName}-sorting.json`,
    JSON.stringify(
        traitTokens,
        null,
        4
    ),
    (error) => {
    if (error) {
        console.log(error);
    }
});

console.log(`Pricing template saved: templates/${_collectionName}-pricing.json`);
console.log(`Sorting template saved: templates/${_collectionName}-sorting.json`);
