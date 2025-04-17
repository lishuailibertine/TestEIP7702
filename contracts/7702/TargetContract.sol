// contracts/TargetContract.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract TargetContract {
    uint256 public value;

    function setValue(uint256 _v) public {
        value = _v;
    }
}