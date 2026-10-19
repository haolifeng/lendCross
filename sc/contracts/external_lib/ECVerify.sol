// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

library ECVerify {

    // secp256k1n / 2，用于 EIP-2 的 s 值上界校验，防止签名可塑性
    uint256 constant SECP256K1N_HALF = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0;

    function ecverify(bytes32 hash, uint8 v, bytes32 r, bytes32 s)
        internal
        pure
        returns (address signature_address)
    {
        // Version of signature should be 27 or 28, but 0 and 1 are also possible
        if (v < 27) {
            v += 27;
        }

        // EIP 155: 2 * chainId + 35
        if (v > 28) {
            v = v % 2 == 1 ? 27 : 28;
        }

        require(v == 27 || v == 28, "ECVerify: invalid v");

        // 安全修复：EIP-2 可塑性防护，s 必须 <= secp256k1n/2，且 r/s 不能为 0
        require(uint256(s) <= SECP256K1N_HALF, "ECVerify: invalid s");
        require(uint256(r) != 0 && uint256(s) != 0, "ECVerify: r/s must be non-zero");

        signature_address = ecrecover(hash, v, r, s);

        // ecrecover returns zero on error
        require(signature_address != address(0x0), "ECVerify revert");

        return signature_address;
    }
}
