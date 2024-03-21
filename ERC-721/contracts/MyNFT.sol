// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// This contract provides a simple implementation of an ERC721 NFT with URI storage, 
// allowing the owner to mint new NFTs with unique IDs and associated metadata URIs. 
// The OpenZeppelin libraries used in this contract provide widely accepted and secure 
// implementations of ERC721 and related functionalities.

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage, Ownable {
  // using Counters for Counters.Counter;
  // Counters.Counter private _todenIds;
  uint256 private _tokenIds;

  constructor() ERC721("MyNFT", "NFT")  Ownable(msg.sender){}

  function safeMint(address recipient, string memory tokenURI) public onlyOwner returns (uint256) {
        uint256 newItemId = _tokenIds;

        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        _tokenIds += 1;
        return newItemId;
    }
}