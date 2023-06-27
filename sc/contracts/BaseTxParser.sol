pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;
import "./external_lib/RLPEncode.sol";
import "./external_lib/ECVerify.sol";

contract BaseTxParser {
    struct AccessListItem {
        address addressK;
        bytes32[]  storageKey;
    }

    function encodeAccess(AccessListItem[]  memory accessList) public pure returns (bytes memory base) {

        bytes[] memory list = new bytes[](accessList.length);

        for(uint256 i= 0; i< accessList.length;i++) {
            bytes[] memory tempList = new bytes[](2);
            tempList[0] = RLPEncode.encodeAddress(accessList[i].addressK);

            bytes[] memory tSubList = new bytes[](accessList[i].storageKey.length);
            for(uint256 j =0; j < accessList[i].storageKey.length; j++){
                tSubList[j] = RLPEncode.encodeBytes(abi.encodePacked(accessList[i].storageKey[j]));
            }
            tempList[1] = RLPEncode.encodeList(tSubList);

            list[i] = RLPEncode.encodeList(tempList);
        }

        base = RLPEncode.encodeList(list);

    }
    function getAccessListItemLength(AccessListItem[]  memory accessList) public pure returns (uint256) {
        return accessList.length;
    }
    function getTxTypeBytes(uint256 txType) public pure returns (bytes memory txTypeBytes){
        txTypeBytes = RLPEncode.encodeUint(txType);
    }

}