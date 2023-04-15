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

    uint256 public price;
    address public owner;

    mapping(address => bytes32) public merkleTrees;
    mapping(address => IChainLinkFeeds) public priceFeeds;

    constructor(
        address _chainLinkFeeds
    ) {
        chainLinkFeeds = IChainLinkFeeds(
            _chainLinkFeeds
        );
    }

    function setPriceFeed(
        address _token,
        address _priceFeed
    )
        external
    {
        priceFeeds[_token] = IChainLinkFeeds(
            _priceFeed
        );
    }

    function getLatestAnswer()
        external
        view
        returns (uint256)
    {
        return chainLinkFeeds.latestAnswer();
    }
}
