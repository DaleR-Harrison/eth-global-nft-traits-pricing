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

    console.log(tree, 'tree');
}