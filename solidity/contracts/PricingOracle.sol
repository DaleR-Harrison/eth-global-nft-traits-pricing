// SPDX-License-Identifier: --GlobalETH--

pragma solidity ^0.8.19;

interface IChainLinkFeeds {

    function latestAnswer()
        external
        view
        returns (uint256);
}

contract PricingOracle {

    IChainLinkFeeds public chainLinkFeeds;

    address public owner;

    mapping(address => bytes32) public merkleTrees;
    mapping(address => IChainLinkFeeds) public priceFeeds;

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "PricingOracle: NOT_OWNER"
        );
        _;
    }

    constructor(
        address _chainLinkFeeds
    ) {
        chainLinkFeeds = IChainLinkFeeds(
            _chainLinkFeeds
        );

        owner = msg.sender;
    }

    function setPriceFeed(
        address _token,
        address _priceFeed
    )
        external
        onlyOwner
    {
        priceFeeds[_token] = IChainLinkFeeds(
            _priceFeed
        );
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
            ) == merkleTrees[_collectionAddress],
            "PricingOracle: INVALID_PROOF"
        );

        uint256 tokenPrice = getFloorPrice(
            _collectionAddress
        ) * _floorPercent;

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

    function getLatestAnswer()
        external
        view
        returns (uint256)
    {
        return chainLinkFeeds.latestAnswer();
    }
}
