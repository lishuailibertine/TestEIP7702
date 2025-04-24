// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

contract TokenPaymaster7702 {
    address public immutable owner;
    IERC20 public immutable token;
    address public immutable paymaster;

    constructor(address _owner, address _token, address _paymaster) {
        owner = _owner;
        token = IERC20(_token);
        paymaster = _paymaster;
    }

    function payWithToken(uint256 tokenAmount) external {
        require(msg.sender == owner, "Not authorized");
        bool success = token.transferFrom(owner, paymaster, tokenAmount);
        require(success, "Token transfer failed");
    }

    function doBusinessLogic() external {
        // 这里执行你真实想做的事，比如 mint、transfer、swap 等
    }
}