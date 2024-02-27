// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NFTFactory {
    struct NFT {
        address id;
        address owner;
        address artist;
        uint256 price;
        bool isMinted;
    }

    mapping(address => NFT[]) public nfts;

    event NewNFT(address indexed nft, address indexed owner, address indexed artist, uint256 price, bool isMinted);

    constructor() {
        // Initialize NFTs (optional)
    }

    function mintNFT(address _owner, address _artist, uint256 _price) public {
        // Check if NFT exists
        require(nfts[_owner].length == 0, "NFT already exists");

        // Generate unique ID for the new NFT
        address nftId = address(bytes20(sha256(abi.encodePacked(_owner, _artist, _price, block.timestamp))));

        // Create new NFT
        NFT memory newNFT = NFT(nftId, _owner, _artist, _price, true);
        nfts[_owner].push(newNFT);

        // Emit event
        emit NewNFT(newNFT.id, newNFT.owner, newNFT.artist, newNFT.price, newNFT.isMinted);
    }

    function burnNFT(address _nft) public {
        // Check if NFT exists
        require(nfts[_nft].length > 0, "NFT does not exist");

        // Remove NFT (set isMinted to false)
        nfts[_nft][0].isMinted = false;
    }

    function transferNFT(address _nft, address _newOwner) public {
        // Check if NFT exists
        require(nfts[_nft].length > 0, "NFT does not exist");

        // Transfer NFT ownership
        nfts[_nft][0].owner = _newOwner;
    }
}
