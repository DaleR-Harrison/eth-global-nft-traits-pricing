// merkle-tree builder for balances:
// boilerplate code -> https://github.com/Uniswap/merkle-distributor/tree/master/src
// modified to work with a simplified data object for project needs

import { utils } from "ethers";
import MerkleTree from "./merkle-tree.js";

export default class BalanceTree {

    constructor(_balances) {
        this.tree = new MerkleTree(
            _balances.map(({ tokenId, percent, ceiling }, index) => {
                return BalanceTree.toNode(
                    index,
                    tokenId,
                    percent,
                    ceiling
                );
            })
        );
    }

    verifyProof(index, tokenId, percent, ceiling, proof, root) {

        let pair = BalanceTree.toNode(
            index,
            tokenId,
            percent,
            ceiling
        );

        for (const item of proof) {
            pair = MerkleTree.combinedHash(
                pair,
                item
            );
        }

        return pair.equals(root);
    }

    static toNode(index, tokenId, percent, ceiling) {
        return Buffer.from(
            utils.solidityKeccak256(
                [
                    "uint256",
                    "uint256",
                    "uint256",
                    "uint256"
                ],
                [
                    index,
                    tokenId,
                    percent.toString(),
                    ceiling.toString(),
                ]
            )
            .substr(2),
            "hex"
        );
    }

    getHexRoot() {
        return this.tree.getHexRoot();
    }

    getProof(index, tokenId, percent, ceiling) {
        return this.tree.getHexProof(
            BalanceTree.toNode(
                index,
                tokenId,
                percent,
                ceiling
            )
        );
    }
}