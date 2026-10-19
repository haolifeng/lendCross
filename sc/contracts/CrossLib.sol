// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

library  CrossLib {
    function bytesToAddress(bytes memory bys) internal pure returns (address addr) {
        // 安全修复：长度不足 20 时 mload 会读取邻近内存垃圾数据，必须先校验
        require(bys.length == 20, "CrossLib: address bytes length must be 20");
        assembly {
            addr := mload(add(bys,20))
        }
    }
    function userLock_decodeInput(bytes calldata data) internal pure returns ( uint , uint , bytes memory ){

        (, uint tokenPairID, uint value, bytes memory userAccount) =  abi.decode(data[4:],(bytes32, uint, uint, bytes));
        return ( tokenPairID, value, userAccount);
    }
    function userBurn_decodeInput(bytes calldata data) internal pure returns (uint, uint, bytes memory){
        (, uint tokenPairID, uint value, ,,bytes memory userAccount) =  abi.decode(data[4:],(bytes32, uint256, uint256, uint256, address, bytes));
        return ( tokenPairID, value, userAccount);
    }
}