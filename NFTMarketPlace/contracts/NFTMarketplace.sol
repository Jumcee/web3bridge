// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract NFTMarketplace is ERC721, Ownable {
    using SafeMath for uint256; // Use the library directly

    uint256 public nextTokenId;
    uint256 public salePrice;

    // Mapping from token ID to owner address
    mapping(uint256 => address) private _tokenOwners;

    // Mapping from token ID to sale status
    mapping(uint256 => bool) private _tokenForSale;

    event TokenMinted(address indexed owner, uint256 indexed tokenId);
    event TokenListed(uint256 indexed tokenId, uint256 salePrice);
    event TokenSold(address indexed buyer, address indexed seller, uint256 indexed tokenId);

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        nextTokenId = 1;
        salePrice = 1 ether; // Initial sale price, can be updated by the owner
    }

    modifier onlyTokenOwner(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender, "Not the token owner");
        _;
    }

    modifier onlyTokenForSale(uint256 tokenId) {
        require(_tokenForSale[tokenId], "Token not listed for sale");
        _;
    }

    function mint() external {
        uint256 tokenId = nextTokenId;
        _safeMint(msg.sender, tokenId);
        _tokenOwners[tokenId] = msg.sender;
        nextTokenId++;
        emit TokenMinted(msg.sender, tokenId);
    }

    function listForSale(uint256 tokenId, uint256 price) external onlyTokenOwner(tokenId) {
        require(price > 0, "Sale price must be greater than zero");
        _tokenForSale[tokenId] = true;
        salePrice = price;
        emit TokenListed(tokenId, price);
    }

    function removeFromSale(uint256 tokenId) external onlyTokenOwner(tokenId) {
        _tokenForSale[tokenId] = false;
    }

    function buy(uint256 tokenId) external payable onlyTokenForSale(tokenId) {
        require(msg.value == salePrice, "Incorrect payment amount");
        address seller = ownerOf(tokenId);
        _tokenOwners[tokenId] = msg.sender;
        _tokenForSale[tokenId] = false;
        payable(seller).transfer(msg.value);
        emit TokenSold(msg.sender, seller, tokenId);
    }

    function setSalePrice(uint256 newPrice) external onlyOwner {
        require(newPrice > 0, "Sale price must be greater than zero");
        salePrice = newPrice;
    }
}
