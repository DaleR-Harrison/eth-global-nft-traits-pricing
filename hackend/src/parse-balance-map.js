import BalanceTree from  "./balance-tree.js";

export function parseBalanceMap(_balanceMap) {

    const allKeys = Object.keys(_balanceMap);
    const treeElements = allKeys.map((tokenId) => ({
        tokenId,
        percent: _balanceMap[tokenId].percent,
        ceiling: _balanceMap[tokenId].ceiling
    }));

    // construct a tree
    const tree = new BalanceTree(
        treeElements
    );

    const res = [];

    treeElements.map((treeElement, i) => {

        const tokenId = treeElement.tokenId;

        const item = _balanceMap[
            tokenId
        ];

        const proof = tree.getProof(
            i,
            tokenId,
            item.percent,
            item.ceiling
        );

        console.log(proof);
    });

    console.log(res);
}