// SPDX-License-Identifier: --GlobalETH--

pragma solidity ^0.8.19;

interface IPricingOracle {

    function getFloorPrice(
        address _collectionAddress
    )
        external
        view
        returns (uint256);

    function getTokenPrice(
        address _collectionAddress,
        uint256 _tokenId,
        uint256 _floorPercent,
        uint256 _maximumPrice,
        bytes32[] memory _proof
    )
        external
        view
        returns (uint256);
}

contract NFTDealer {

}