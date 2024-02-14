// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


contract Token {
     string public name = "Jumcee";
     string public symbol = "JC";
     uint8 public decimals = 18;

     uint256 public totalSupply;

    mapping(address => uint) private balance;
    mapping(address =>  mapping(address => uint256)) private allowances;

    event Transfer(address indexed sender, address indexed recipent, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(string _name, string _symbol, uint8 _decimal, initialSupply) {
        name = _name;
        symbol = _symbol;
        decimal = _decimal;
        totalSupply = initialSupply;
        balances[msg.sender] = initialSupply;
    }

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address owner) external view returns (unit256) {
        return _balanceOf;
    }

    function allowances(address owner, address spender) external view returns (uint256) {
        returns allowances.address[owner][spender];
    }

    function Transfer(address recipient, uint256 value) external view returns (bool) {
        require(balance[msg.sender] => amount, "Not enough amount");
        balance[msg.sender] -= amount;
        balance[recipient] += amount;
        emit Transfer(address indexed sender, address indexed recipient, uint256 value);
        return true;
    } 

    function approve(address sender, uint256 value) external view returns (bool) {
        _allowance[sender][owner] = value;
        emit Approval(sender, recipient, uint256 value);
        return true;
    }
}
    