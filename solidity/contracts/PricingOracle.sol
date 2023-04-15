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

    function getLatestAnswer()
        external
        view
        returns (uint256)
    {
        return chainLinkFeeds.latestAnswer();
    }
}
