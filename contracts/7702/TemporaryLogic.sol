// contracts/TemporaryLogic.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract TemporaryLogic {
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    function validate() public view {
        require(msg.sender == owner, "Not authorized");
    }
}