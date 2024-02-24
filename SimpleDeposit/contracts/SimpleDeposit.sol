// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleDeposit {

    mapping(address => uint256) public balances; // Stores individual user balances
    uint256 public totalDeposits; // Tracks total funds deposited

    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        balances[msg.sender] += msg.value;
        totalDeposits += msg.value;
    }

    function getBalance(address user) public view returns (uint256) {
        return balances[user];
    }
}