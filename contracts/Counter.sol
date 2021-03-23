// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "hardhat/console.sol";

contract Counter {
    uint256 private count;

    event CountedTo(uint256 number);

    constructor() {
        count = 0;
        console.log("Example of console.log", count);
    }

    function getCount() public view returns (uint256) {
        return count;
    }

    function countUp() public returns (uint256) {
        uint256 newCount = count + 1;
        require(newCount > count, "Uint256 overflow");
        count = newCount;
        emit CountedTo(count);
        return count;
    }

    function countDown() public returns (uint256) {
        uint256 newCount = count - 1;
        require(newCount < count, "Uint256 underflow");
        count = newCount;
        emit CountedTo(count);
        return count;
    }
}
