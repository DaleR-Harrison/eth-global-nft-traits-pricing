require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-ethers");

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 1337,
            forking: {
                url: "https://eth-mainnet.g.alchemy.com/v2/J3bTM7KLiYYwh8Ar_VBXuo-oLlGTx7od",
                blockNumber: 16827927,
                enabled: false
            }
        },
    },
    live: {
        chainId: 1337,
        allowUnlimitedContractSize: false,
        blockGasLimit: 100000000,
        callGasLimit: 100000000,
        url: "http://127.0.0.1:9540/"
    },
    solidity: {
        version: "0.8.19",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
    }
}