// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NFTSocial {
    // User authentication
    mapping(address => bool) public authenticatedUsers;

    // Role-based access control (RBAC)
    mapping(address => bool) public admins;

    // Groups/Communities
    mapping(address => mapping(address => bool)) public groups;

    // Gasless transaction mapping
    mapping(address => bool) public gaslessUsers;

    // NFT Factory contract
    address public nftFactory;

    // NFT Social Media contract
    address public nftSocialMedia;

    event NewUser(address indexed user);
    event NewGroup(address indexed user, address indexed group);
    event NFTCreated(address indexed nft);
    event PostCreated(address indexed user, address indexed nft, uint256 indexed timestamp);

    modifier onlyAdmin() {
        require(admins[msg.sender], "Not authorized");
        _;
    }

    modifier onlyGaslessUser() {
        require(gaslessUsers[msg.sender], "Gasless transaction not allowed");
        _;
    }

    constructor(address _nftFactory, address _nftSocialMedia) {
        admins[msg.sender] = true;
        nftFactory = _nftFactory;
        nftSocialMedia = _nftSocialMedia;
    }

    function authenticateUser() external {
        authenticatedUsers[msg.sender] = true;
        emit NewUser(msg.sender);
    }

    function createGroup(address _group) external onlyAdmin {
        groups[msg.sender][_group] = true;
        emit NewGroup(msg.sender, _group);
    }

    function enableGaslessTransaction() external {
        gaslessUsers[msg.sender] = true;
    }

    function disableGaslessTransaction() external {
        gaslessUsers[msg.sender] = false;
    }

    function createNFT() external onlyGaslessUser {
        (bool success, ) = nftFactory.delegatecall(abi.encodeWithSignature("mintNFT(address,address,uint256)", msg.sender, msg.sender, 1));
        require(success, "NFT creation failed");
        emit NFTCreated(msg.sender);
    }

    function createPost(address _nft, uint256 _timestamp) external {
        require(authenticatedUsers[msg.sender], "User not authenticated");
        require(groups[msg.sender][_nft], "User not part of the group");
        (bool success, ) = nftSocialMedia.delegatecall(abi.encodeWithSignature("createPost(address,address,uint256)", msg.sender, _nft, _timestamp));
        require(success, "Post creation failed");
        emit PostCreated(msg.sender, _nft, _timestamp);
    }
}
