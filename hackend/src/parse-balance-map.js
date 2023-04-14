import BalanceTree from  "./balance-tree.js";

    const sortedAddresses = Object.keys(dataByAddress).sort()

    // construct a tree
    const tree = new BalanceTree(
        sortedAddresses.map(address => ({
            account: address,
            amount: dataByAddress[address].amount
        }))
    )

    // generate claims
    const claims = sortedAddresses.reduce((memo, address, index) => {
        const {
            amount,
            flags
        } = dataByAddress[address]
        memo[address] = {
            index,
            amount: amount.toHexString(),
            proof: tree.getProof(index, address, amount),
            ...(flags ? {
                flags
            } : {})
        }
        return memo
    }, {})

    const tokenTotal = sortedAddresses.reduce(
        (memo, key) => memo.add(dataByAddress[key].amount),
        BigNumber.from(0)
    )

    return {
        merkleRoot: tree.getHexRoot(),
        tokenTotal: tokenTotal.toHexString(),
        claims
    }
}