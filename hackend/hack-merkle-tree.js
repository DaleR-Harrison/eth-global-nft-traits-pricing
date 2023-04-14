import fs from 'fs';
import { program } from 'commander';

program.requiredOption(
    '-n, --collectionName <collectionName>'
);

program.parse(
    process.argv
);

const _collectionName = program.collectionName;

const pricing = JSON.parse(
    fs.readFileSync(
        `templates/${_collectionName}-pricing.json`,
        {
            encoding: 'utf8'
        }
    )
);

const sorting = JSON.parse(
    fs.readFileSync(
        `templates/${_collectionName}-sorting.json`,
        {
            encoding: 'utf8'
        }
    )
);

console.log(pricing, 'pricing');
console.log(sorting, 'sorting');