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
        uint256 _merkleIndex,
        uint256 _floorPercent,
        uint256 _maximumPrice,
        bytes32[] memory _proof
    )
        external
        view
        returns (uint256);
}

contract NFTDealer {

    address public owner;
    IPricingOracle public pricingOracle;

    modifier onlyShopOwner() {
        require(
            msg.sender == owner,
            "NFTDealer: NOT_OWNER"
        );
        _;
    }

    struct Loan {
        uint256 lastPayment;
        uint256 borrowAmount;
        address borrowAddress;
        address collectionAddress;
        uint256 tokenId;
    }

    mapping(uint256 => Loan) public loans;

    event Received(
        address,
        uint256
    );

    receive()
        external
        payable
    {
        emit Received(
            msg.sender,
            msg.value
        );
    }

    constructor(
        IPricingOracle _pricingOracle
    ) {
        owner = msg.sender;
        pricingOracle = _pricingOracle;
    }

    function withdrawFunds(
        uint256 _amount
    )
        external
        onlyShopOwner
    {
        payable(msg.sender).transfer(
            _amount
        );
    }

    function borrowETH(
        uint256 _borrowAmount,
        address _collectionAddress,
        uint256 _tokenId,
        uint256 _merkleIndex,
        uint256 _floorPercent,
        uint256 _maximumPrice,
        bytes32[] memory _proof
    )
        external
        returns (bool)
    {
        uint256 tokenPrice = pricingOracle.getTokenPrice(
            _collectionAddress,
            _tokenId,
            _merkleIndex,
            _floorPercent,
            _maximumPrice,
            _proof
        );

        if (_borrowAmount > tokenPrice) {
            _borrowAmount = tokenPrice;
        }

        _transferFromNFT(
            _collectionAddress,
            msg.sender,
            address(this),
            _tokenId
        );

        payable(msg.sender).transfer(
            _borrowAmount
        );

        return true;
    }

    function _transferFromNFT(
        address _from,
        address _to,
        address _collectionAddress,
        uint256 _tokenId
    )
        internal
    {
        bytes memory data = abi.encodeWithSignature(
            "safeTransferFrom(address,address,uint256)",
            _from,
            _to,
            _tokenId
        );

        (bool success, bytes memory resultData) = address(_collectionAddress).call(
            data
        );

        require(
            success,
            string(resultData)
        );
    }
}