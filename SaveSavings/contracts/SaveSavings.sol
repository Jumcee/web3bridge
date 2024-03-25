// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SavingsContract is Ownable {
    IERC20 public token;

    event Deposit(address indexed account, uint256 amount);
    event Withdrawal(address indexed account, uint256 amount);

    constructor(address _token) Ownable(msg.sender) {
        require(_token != address(0), "Token address cannot be zero");
        token = IERC20(_token);
    }

    function deposit(uint256 _amount) external {
        require(_amount > 0, "Deposit amount must be greater than zero");
        require(token.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        emit Deposit(msg.sender, _amount);
    }

    function withdraw(uint256 _amount) external {
        require(_amount > 0, "Withdrawal amount must be greater than zero");
        require(token.balanceOf(address(this)) >= _amount, "Insufficient funds");

        require(token.transfer(msg.sender, _amount), "Transfer failed");

        emit Withdrawal(msg.sender, _amount);
    }

    function withdrawAll() external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "No funds to withdraw");

        require(token.transfer(owner(), balance), "Transfer failed");

        emit Withdrawal(owner(), balance);
    }

    function getBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }
}
