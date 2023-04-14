// merkle-tree builder for balances:
// boilerplate code -> https://github.com/Uniswap/merkle-distributor/tree/master/src
// modified to work with a simplified data object for project needs

import MerkleTree from "./merkle-tree.js";
import { utils } from "ethers";

export default class BalanceTree {
    constructor(balances) {
        this.tree = new MerkleTree(
            balances.map(({
                account,
                amount
            }, index) => {
                return BalanceTree.toNode(
                    index,
                    account,
                    amount
                );
            })
        );
    }

    static verifyProof(index, account, amount, proof, root) {
        let pair = BalanceTree.toNode(
            index,
            account,
            amount
        );
        for (const item of proof) {
            pair = MerkleTree.combinedHash(
                pair,
                item
            );
        }

        return pair.equals(root);
    }

    // keccak256(abi.encode(index, account, amount))
    static toNode(index, account, amount) {
        return Buffer.from(
            utils
            .solidityKeccak256(
                [
                    "uint256",
                    "address",
                    "uint256"
                ],
                [
                    index,
                    account,
                    amount
                ]
            )
            .substr(2),
            "hex"
        )
    }

    getHexRoot() {
        return this.tree.getHexRoot()
    }

    getProof(index, account, amount) {
        return this.tree.getHexProof(
            BalanceTree.toNode(
                index,
                account,
                amount
            )
        );
    }
}