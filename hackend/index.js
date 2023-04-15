import express from "express";
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path'
import { exec, spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/getPricingData/:collectionName/:tokenId/:stringify?', (req, res) => {
    const { collectionName, tokenId } = req.params;
    const stringify =req.params.stringify === 'true';

    if (!collectionName || !tokenId) {
        return res.status(400).json({ error: 'Invalid parameters' });
    }

    const filePath = path.join(__dirname, 'trees-output/' + collectionName + '.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read collection data' });
        }

        let collectionData;
        try {
            collectionData = JSON.parse(data);
        } catch (e) {
            return res.status(500).json({ error: 'Error parsing collection data' });
        }

        const pricingData = collectionData.PricingData.find((item) => item.tokenId === tokenId);

        if (!pricingData) {
            return res.status(404).json({ error: 'Token info for specified token ID was not found'});
        }

        const responseObject = {
            CollectionName: collectionData.CollectionName,
            CollectionAddress: collectionData.CollectionAddress,
            MerkleRoot: collectionData.MerkleRoot,
            PricingData: pricingData
        }

        if (stringify) {
            res.send(JSON.stringify(responseObject, null, 4))
        }
        else {
            res.json(responseObject);
        }
    });
});

app.post('/fetchAlchemyData/:collectionName/:collectionAddress', (req, res) => {
    const { collectionName, collectionAddress } = req.params;

    if (!collectionName || !collectionAddress) {
        return res.status(400).json({ error: 'Invalid parameters' });
    }

    const command = 'yarn';
    const args = ['hack-alchemy-data', '-n', collectionName, '-a', collectionAddress];

    const child = spawn(command, args, {
        detached: true,
        stdio: 'ignore'
    });

    child.unref();

    res.json({ message: 'Script started successfully'});
});

//Listen to port
const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
    console.log('Server listening on port ${PORT}')
});