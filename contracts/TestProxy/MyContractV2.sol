// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MyContractV2 {
    uint256 public value;

    function initialize(uint256 _value) public {
        value = _value;
    }

    function getValue() public view returns (uint256) {
        return value;
    }

    function setValue(uint256 _value) public {
        value = _value;
    }

    function doubleValue() public {
        value *= 2;
    }
}