// SPDX-License-Identifier: --GlobalETH--

pragma solidity ^0.8.19;

interface IChainLinkFeeds {

    function latestAnswer()
        external
        view
        returns (uint256);
}

contract PricingOracle {

    address public oracleDataSupplier;

    mapping(address => bytes32) public merkleRoots;
    mapping(address => IChainLinkFeeds) public priceFeeds;

    modifier onlyDataSupplier() {
        require(
            msg.sender == oracleDataSupplier,
            "PricingOracle: NOT_OWNER"
        );
        _;
    }

    constructor(
        address _collectionAddress,
        bytes32 _collectionMerkleRoot,
        IChainLinkFeeds _chainLinkFeed
    ) {
        priceFeeds[_collectionAddress] = _chainLinkFeed;
        merkleRoots[_collectionAddress] = _collectionMerkleRoot;
        oracleDataSupplier = msg.sender;
    }

    function setPriceFeed(
        address _collectionAddress,
        IChainLinkFeeds _chainLinkFeed
    )
        external
        onlyDataSupplier
    {
        priceFeeds[_collectionAddress] = _chainLinkFeed;
    }

    function setMerkleRoot(
        address _collectionAddress,
        bytes32 _collectionMerkleRoot
    )
        external
        onlyDataSupplier
    {
        merkleRoots[_collectionAddress] = _collectionMerkleRoot;
    }


    function getFloorPrice(
        address _collectionAddress
    )
        public
        view
        returns (uint256)
    {
        return priceFeeds[_collectionAddress].latestAnswer();
    }

    function getTokenPrice(
        address _collectionAddress,
        uint256 _tokenId,
        uint256 _merkleIndex,
        uint256 _floorPercent,
        uint256 _maximumPrice,
        bytes32[] memory _proof
    )
        external
        view
        returns (uint256)
    {
        bytes32 leaf = keccak256(
            abi.encodePacked(
                _merkleIndex,
                _tokenId,
                _floorPercent,
                _maximumPrice
            )
        );

        require(
            _getRootHash(
                leaf,
                _proof
            ) == merkleRoots[_collectionAddress],
            "PricingOracle: INVALID_PROOF"
        );

        uint256 tokenPrice = getFloorPrice(
            _collectionAddress
        ) * _floorPercent / 100;

        if (tokenPrice > _maximumPrice) {
            tokenPrice = _maximumPrice;
        }

        return tokenPrice;
    }

    function _getRootHash(
        bytes32 _leaf,
        bytes32[] memory _proof
    )
        internal
        pure
        returns (bytes32)
    {
        bytes32 computedHash = _leaf;

        for (uint256 i = 0; i < _proof.length; i++) {
            bytes32 proofElement = _proof[i];

            if (computedHash < proofElement) {
                // Hash(current computed hash + current element of the proof)
                computedHash = keccak256(
                    abi.encodePacked(
                        computedHash,
                        proofElement
                    )
                );
            } else {
                // Hash(current element of the proof + current computed hash)
                computedHash = keccak256(
                    abi.encodePacked(
                        proofElement,
                        computedHash
                    )
                );
            }
        }

        return computedHash;
    }
}
