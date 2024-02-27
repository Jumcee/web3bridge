// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NFTSocialMedia is NFTFactory {
    // Import User and NFT structs from NFTFactory.sol
     import "./NFTFactory.sol";

    struct Post {
        address id;
        address user;
        address nft;
        uint256 timestamp;
        bool isLiked;
    }

    mapping(address => NFTFactory.User) public users;
    mapping(address => NFTFactory.NFT) public nfts;

    Post[] public posts;

    event NewPost(address indexed post, address indexed user, address indexed nft, uint256 timestamp, bool isLiked);

    constructor() public {
        // Initialize posts
        posts = [];
    }

    function createPost(address _user, address _nft, uint256 _timestamp) public {
        // Check if user and NFT exist
        require(users[_user].id != address(0), "User does not exist");
        require(nfts[_nft].id != address(0), "NFT does not exist");

        // Create new post
        Post memory newPost = Post(_user, _nft, _timestamp, false);
        posts.push(newPost);

        // Emit event
        emit NewPost(newPost.id, newPost.user, newPost.nft, newPost.timestamp, newPost.isLiked);
    }

    function likePost(uint256 _index) public {
        // Check if post exists
        require(_index < posts.length, "Post does not exist");

        // Like post
        posts[_index].isLiked = true;
    }

    function unlikePost(uint256 _index) public {
        // Check if post exists
        require(_index < posts.length, "Post does not exist");

        // Unlike post
        posts[_index].isLiked = false;
    }

    function getPosts() public view returns (Post[] memory) {
        return posts;
    }

    function getPost(uint256 _index) public view returns (Post memory) {
        return posts[_index];
    }
}