// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MyContract.sol";

contract MyContractFactory {
    event MyContractCreated(address indexed creator, address indexed contractAddress);

    function createMyContract() external {
        MyContract newContract = new MyContract();
        emit MyContractCreated(msg.sender, address(newContract));
    }
}
