export function parseBalanceMap(balances) {
  const dataByAddress = balancesInNewFormat.reduce(
      (memo, {
          address: account,
          earnings,
          reasons
      }) => {
          if (!isAddress(account)) {
              throw new Error(`Found invalid address: ${account}`)
          }
          const parsed = getAddress(account)
          if (memo[parsed]) throw new Error(`Duplicate address: ${parsed}`)
          const parsedNum = BigNumber.from(earnings)
          if (parsedNum.lte(0))
              throw new Error(`Invalid amount for account: ${account}`)

          const flags = {
              isSOCKS: reasons.includes("socks"),
              isLP: reasons.includes("lp"),
              isUser: reasons.includes("user")
          }

          memo[parsed] = {
              amount: parsedNum,
              ...(reasons === "" ? {} : {
                  flags
              })
          }
          return memo
      }, {}
  )

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