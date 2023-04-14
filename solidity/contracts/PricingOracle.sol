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

    constructor(
        address _chainLinkFeeds
    ) {
        chainLinkFeeds = IChainLinkFeeds(
            _chainLinkFeeds
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
