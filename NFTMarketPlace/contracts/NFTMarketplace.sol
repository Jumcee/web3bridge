/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ERC721, Ownable {
    // Counter to track token IDs
    uint256 private _tokenIdCounter;

    // Mapping from token ID to listing price
    mapping(uint256 => uint256) private _listingPrices;

    // Events
    event NFTMinted(address indexed owner, uint256 indexed tokenId);
    event NFTListed(uint256 indexed tokenId, uint256 price);
    event NFTSold(address indexed buyer, address indexed seller, uint256 indexed tokenId, uint256 price);

     constructor(string memory name, string memory symbol) ERC721(name, symbol) Ownable(msg.sender) {
    }

    // Mint new NFT
    function mint() external onlyOwner {
        uint256 tokenId = _tokenIdCounter;
        _safeMint(msg.sender, tokenId);
        _tokenIdCounter += 1;

        emit NFTMinted(msg.sender, tokenId);
    }

    // List NFT for sale
    function listForSale(uint256 tokenId, uint256 price) external {
    require(ownerOf(tokenId) == msg.sender, "Not the owner of the NFT");
    require(price > 0, "Price must be greater than 0");
    _listingPrices[tokenId] = price;

    emit NFTListed(tokenId, price);
}


    // Buy NFT
    function buyNFT(uint256 tokenId) external payable {
        address owner = ownerOf(tokenId);
        uint256 price = _listingPrices[tokenId];

        require(price > 0, "NFT not listed for sale");
        require(msg.value == price, "Incorrect payment amount");

        // Transfer ownership
        _transfer(owner, msg.sender, tokenId);
        _listingPrices[tokenId] = 0; // Remove listing

        // Transfer funds to seller
        payable(owner).transfer(msg.value);

        emit NFTSold(msg.sender, owner, tokenId, price);
    }

    // Get listing price of an NFT
    function getListingPrice(uint256 tokenId) external view returns (uint256) {
        return _listingPrices[tokenId];
    }

    // Withdraw funds from the contract (onlyOwner)
    function withdrawFunds() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}