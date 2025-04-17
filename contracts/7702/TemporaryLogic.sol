// contracts/TemporaryLogic.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract TemporaryLogic {
    address public owner;
    uint256 public value;
    constructor(address _owner, uint256 _value) {
        value = _value;
        owner = _owner;
    }

    function validate() public view {
        require(msg.sender == owner, "Not authorized");
    }
}