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
