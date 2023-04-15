# eth-global-nft-traits-pricing#

# 1. Get NFT Collection Metadata

`cd hackend`

`yarn hack-alchemy-data -n BoredApes -a 0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D`

`yarn hack-alchemy-data -n MoonBirds -a 0x23581767a106ae21c074b2276D25e5C3e136a68b`

## 2. Create Pricing Input Template

`yarn hack-pricing-template -n BoredApes`
`yarn hack-pricing-template -n MoonBirds`

## 3. Create Merkle Tree

`yarn hack-merkles-tree -n BoredApes`
`yarn hack-merkles-tree -n MoonBirds`


# Goerli Testnet: https://goerli.etherscan.io/address/0xFadc870ad12c88b621Bb906032Bef2eE2427c42a#readContract