import BalanceTree from  "./balance-tree.js";

export function parseBalanceMap(
    _balanceMap,
    _collectionName,
    _collectionAddress
) {

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

    const result = [];

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

        result.push({
            index: i,
            tokenId: tokenId,
            percent: item.percent,
            ceiling: item.ceiling,
            proof: proof
        });
    });

    return {
        "CollectionName": _collectionName,
        "CollectionAddress": _collectionAddress,
        "MerkleRoot": tree.getHexRoot(),
        "PricingData": result,
        "GenerationTime": new Date().toISOString()
    }
}