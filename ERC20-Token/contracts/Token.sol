// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Token {
    string public name = "Jumcee";
    string public symbol = "JC";
    uint8 public decimals = 18;

    uint256 public totalSupply;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    event Transfer(address indexed sender, address indexed recipient, uint256 amount);
    event Approval(address indexed owner, address indexed spender, uint256 amount);

    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 initialSupply) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = initialSupply;
        _balances[msg.sender] = initialSupply;
    }

    function getTotalSupply() external view returns (uint256) {
        return totalSupply;
    }

    function getBalance(address owner) external view returns (uint256) {
        return _balances[owner];
    }

    function getAllowance(address owner, address spender) external view returns (uint256) {
        return _allowances[owner][spender];
    }

    function transfer(address recipient, uint256 amount) external returns (bool) {
        require(_balances[msg.sender] >= amount, "Not enough amount");

        // Calculate 10% charges
        uint256 charge = (amount * 10) / 100;

        // Calculate transfer amount after deducting 10% charge
        uint256 transferAmount = amount - charge;

        _balances[msg.sender] -= amount;
        _balances[recipient] += transferAmount;

        emit Transfer(msg.sender, recipient, transferAmount);

        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(amount <= _balances[from], "Insufficient balance");
        require(amount <= _allowances[from][msg.sender], "Insufficient allowance");

        // Deduct 10% as a charge
        uint256 charge = (amount * 10) / 100;
        uint256 transferAmount = amount - charge;

        _balances[from] -= amount;
        _balances[to] += transferAmount;
        _allowances[from][msg.sender] -= amount;

        emit Transfer(from, to, transferAmount);

        return true;
    }
}
