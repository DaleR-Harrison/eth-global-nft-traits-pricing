// SPDX-License-Identifier: --GlobalETH--

pragma solidity ^0.8.19;

contract Helper {

    event ERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes data
    );

    function _transferNFT(
        address _from,
        address _to,
        address _tokenAddress,
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

        (bool success,) = address(_tokenAddress).call(
            data
        );

        require(
            success == true,
            "Helper: TRANSFER_FAILED"
        );
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

    function onERC721Received(
        address _operator,
        address _from,
        uint256 _tokenId,
        bytes calldata _data
    )
        external
        returns (bytes4)
    {
        emit ERC721Received(
            _operator,
            _from,
            _tokenId,
            _data
        );

        return this.onERC721Received.selector;
    }
}