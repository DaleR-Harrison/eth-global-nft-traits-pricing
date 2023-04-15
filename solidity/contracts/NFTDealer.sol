// SPDX-License-Identifier: --GlobalETH--

pragma solidity ^0.8.19;

import "./Helper.sol";

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

contract NFTDealer is Helper {

    address public shopOwner;
    IPricingOracle public pricingOracle;

    uint256 public paymentInterval = 42 days;
    uint256 public paymentInterest = 0.01 ether;

    modifier onlyShopOwner() {
        require(
            msg.sender == shopOwner,
            "NFTDealer: NOT_SHOP_OWNER"
        );
        _;
    }

    enum LoanStatus {
        ACTIVE,
        PAID,
        LIQUIDATED
    }

    struct Loan {
        LoanStatus status;
        uint256 lastPayment;
        uint256 borrowAmount;
        address borrowAddress;
        address collectionAddress;
        uint256 tokenId;
    }

    uint256 public loanCount;
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
        shopOwner = msg.sender;
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
        returns (uint256)
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

        loans[loanCount] = Loan({
            status: LoanStatus.ACTIVE,
            lastPayment: block.timestamp,
            borrowAmount: _borrowAmount,
            borrowAddress: msg.sender,
            collectionAddress: _collectionAddress,
            tokenId: _tokenId
        });

        loanCount = loanCount + 1;

        payable(msg.sender).transfer(
            _borrowAmount
        );

        return _borrowAmount;
    }

    function repayLoan(
        uint256 _loanId
    )
        external
        payable
    {
        Loan memory loan = loans[_loanId];

        require(
            loan.status == LoanStatus.ACTIVE,
            "NFTDealer: INACTIVE_LOAN"
        );

        uint256 timePassed = block.timestamp
            - loan.lastPayment;

        require(
            timePassed < paymentInterval,
            "NFTDealer: TOO_LATE"
        );

        uint256 totalPayment = paymentInterest
            + loan.borrowAmount;

        require(
            totalPayment == msg.value,
            "NFTDealer: INVALID_AMOUNT"
        );

        _transferNFT(
            address(this),
            loan.borrowAddress,
            loan.collectionAddress,
            loan.tokenId
        );

        loans[_loanId].status = LoanStatus.PAID;
    }

    function liquidateLoan(
        uint256 _loanId
    )
        external
    {
        Loan memory loan = loans[_loanId];

        require(
            loan.status == LoanStatus.ACTIVE,
            "NFTDealer: INACTIVE_LOAN"
        );

        uint256 timePassed = block.timestamp
            - loan.lastPayment;

        require(
            timePassed > paymentInterval,
            "NFTDealer: TOO_EARLY"
        );

        _transferNFT(
            address(this),
            shopOwner,
            loan.collectionAddress,
            loan.tokenId
        );

        loans[_loanId].status = LoanStatus.LIQUIDATED;
    }
}