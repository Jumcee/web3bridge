// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NFTFactory.sol";

contract NFTSocialMedia {
    // Import User and NFT structs from NFTFactory.sol
    import "./NFTFactory.sol";


    struct Post {
        address id;
        address user;
        address nft;
        uint256 timestamp;
        bool isLiked;
    }

    // Use User and NFT structs from NFTFactory.sol
    mapping(address => NFTFactory.User) public users;
    mapping(address => NFTFactory.NFT) public nfts;

    Post[] public posts;

    event NewPost(address indexed post, address indexed user, address indexed nft, uint256 timestamp, bool isLiked);

    function createPost(address _user, address _nft, uint256 _timestamp) public {
        // Check if user and NFT exist
        require(users[_user].id != address(0), "User does not exist");
        require(nfts[_nft].id != address(0), "NFT does not exist");

        // Create new post
        Post memory newPost = Post({
            id: address(this), // You need to provide a value for 'id' field, I used the contract address as an example
            user: _user,
            nft: _nft,
            timestamp: _timestamp,
            isLiked: false
        });
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
}
