// contracts/TargetContract.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
contract Multisig7702 {
    struct TxRequest {
        address to;
        uint256 value;
        bytes data;
    }

    function validate(
        address[] calldata owners,
        uint256 threshold,
        TxRequest calldata txReq,
        bytes[] calldata signatures
    ) external pure{
        bytes32 txHash = keccak256(abi.encodePacked(
            txReq.to, txReq.value, txReq.data
        ));

        uint256 sigCount = 0;
        for (uint i = 0; i < signatures.length; i++) {
            address signer = recover(txHash, signatures[i]);
            for (uint j = 0; j < owners.length; j++) {
                if (owners[j] == signer) {
                    sigCount++;
                    break;
                }
            }
        }

        require(sigCount >= threshold, "Not enough valid signatures");
    }
    function recover(bytes32 hash, bytes memory sig) internal pure returns (address) {
        return ECDSA.recover(hash, sig);
    }
}