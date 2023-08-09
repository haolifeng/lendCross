// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "./BaseTxParser.sol";


contract Type0TxParser is BaseTxParser {

    struct Info {
        uint256 nonce;
        uint256 gasPrice;
        uint256 gasLimit;
        address to;
        uint256 value;
        bytes  data;
        uint8 v;
        uint256 r;
        uint256 s;
    }

    function raw(Info memory info) public pure returns (bytes memory base) {
        bytes[] memory list = new bytes[](9);

        list[0] = RLPEncode.encodeUint(info.nonce);
        list[1] = RLPEncode.encodeUint(info.gasPrice);

        list[2] = RLPEncode.encodeUint(info.gasLimit);
        list[3] = RLPEncode.encodeAddress(info.to);
        list[4] = RLPEncode.encodeUint(info.value);
        list[5] = RLPEncode.encodeBytes(info.data);

        list[6] = RLPEncode.encodeUint(info.v);
        list[7] = RLPEncode.encodeUint(info.r);
        list[8] = RLPEncode.encodeUint(info.s);

        base = RLPEncode.encodeList(list);
    }
    function hash(Info memory info ) public pure returns (bytes32 hashBytes){
        bytes memory base = raw(info);
        hashBytes = keccak256(base);
    }
    function getSender(Info calldata info, uint256 chainId) pure public returns (address sender ) {
        bytes[] memory list = new bytes[](9);

        list[0] = RLPEncode.encodeUint(info.nonce);
        list[1] = RLPEncode.encodeUint(info.gasPrice);
        list[2] = RLPEncode.encodeUint(info.gasLimit);
        list[3] = RLPEncode.encodeAddress(info.to);
        list[4] = RLPEncode.encodeUint(info.value);
        list[5] = RLPEncode.encodeBytes(info.data);
        list[6] = RLPEncode.encodeUint(chainId);
        list[7] = RLPEncode.encodeUint(0);
        list[8] = RLPEncode.encodeUint(0);


        bytes32 message_hash = keccak256(RLPEncode.encodeList(list));
        sender = ECVerify.ecverify(message_hash, info.v, bytes32(info.r), bytes32(info.s));

    }



    function handlerTxWanLend(bytes32 uniquID, address from,  Info calldata info, uint256 chainId, uint actualValue, uint eventType) onlyOwner external {
        bool check = checkUniqeID(uniquID);
        require(check == false, "uniquID has been handled");
        bytes32 hashBytes = hash(info);
        require(hashBytes == uniquID,"uniqueID  !== hashBytes");

        address sender = getSender(info, chainId);
        require(sender == from, "sender !== from");

        crossOperation(eventType,info.data, from, actualValue);
        setUniqueIDFinished(uniquID);

    }
}