
pragma solidity ^0.7.0;

library  CrossLib {
    function bytesToAddress(bytes memory bys) public pure returns (address addr) {
        assembly {
            addr := mload(add(bys,20))
        }
    }
    function decodeInput(bytes calldata data) public pure returns ( uint , uint , bytes memory ){

        (, uint tokenPairID, uint value, bytes memory userAccount) =  abi.decode(data[4:],(bytes32, uint, uint, bytes));
        return ( tokenPairID, value, userAccount);
    }
}