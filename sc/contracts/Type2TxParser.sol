// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "./BaseTxParser.sol";


contract Type2TxParser is BaseTxParser {


    struct Info {
        uint256 chainId;
        uint256 nonce;
        uint256 maxPriorityFeePerGas;
        uint256 maxFeePerGas;
        uint256 gasLimit;
        address to;
        uint256 value;
        bytes  data;
        AccessListItem[]  accessList;
        uint8 v;
        uint256 r;
        uint256 s;
    }

    function raw(Info memory info) public pure returns (bytes memory base) {
        bytes memory accessListBuf = encodeAccess(info.accessList);
        bytes[] memory list = new bytes[](12);
        list[0] = RLPEncode.encodeUint(info.chainId);
        list[1] = RLPEncode.encodeUint(info.nonce);
        list[2] = RLPEncode.encodeUint(info.maxPriorityFeePerGas);
        list[3] = RLPEncode.encodeUint(info.maxFeePerGas);
        list[4] = RLPEncode.encodeUint(info.gasLimit);
        list[5] = RLPEncode.encodeAddress(info.to);
        list[6] = RLPEncode.encodeUint(info.value);
        list[7] = RLPEncode.encodeBytes(info.data);
        list[8] = accessListBuf;
        list[9] = RLPEncode.encodeUint(info.v);
        list[10] = RLPEncode.encodeUint(info.r);
        list[11] = RLPEncode.encodeUint(info.s);

        base = RLPEncode.encodeList(list);
    }

    function serialize(Info memory info ,uint256 txType ) public pure returns (bytes memory serializeBytes){
        bytes memory base = raw(info);
        bytes memory txTypeBytes = getTxTypeBytes(txType);

        serializeBytes = abi.encodePacked( txTypeBytes,base);
    }
    function hash(Info memory info ,uint256 txType ) public pure returns (bytes32 hashBytes){
        bytes memory b = serialize(info, txType);
        hashBytes = keccak256(b);
    }
    function getSender(Info calldata info, uint256 txType) pure public returns (address sender ) {
        bytes memory accessListBuf = encodeAccess(info.accessList);
        bytes[] memory list = new bytes[](9);
        list[0] = RLPEncode.encodeUint(info.chainId);
        list[1] = RLPEncode.encodeUint(info.nonce);
        list[2] = RLPEncode.encodeUint(info.maxPriorityFeePerGas);
        list[3] = RLPEncode.encodeUint(info.maxFeePerGas);
        list[4] = RLPEncode.encodeUint(info.gasLimit);
        list[5] = RLPEncode.encodeAddress(info.to);
        list[6] = RLPEncode.encodeUint(info.value);
        list[7] = RLPEncode.encodeBytes(info.data);
        list[8] = accessListBuf;


        bytes memory base = RLPEncode.encodeList(list);


        bytes memory txTypeBytes = getTxTypeBytes(txType);

        bytes memory serializeBytes = abi.encodePacked( txTypeBytes,base);
        bytes32  message_hash = keccak256(serializeBytes);
        sender = ECVerify.ecverify(message_hash, info.v, bytes32(info.r), bytes32(info.s));
    }


    function handlerTxWanLend(bytes32 uniquID, address from,  Info calldata info,uint256 txType, uint actualValue, uint eventType ) onlyOwner external {
        bool check = checkUniqeID(uniquID);
        require(check == false, "uniquID has been handled");
        bytes32 hashBytes = hash(info, txType);
        require(hashBytes == uniquID,"uniqueID  !== hashBytes");

        address sender = getSender(info, txType);
        require(sender == from, "sender !== from");

        //checkout info.to is fromchain  crossDelegate scAddr
        bool ret = checkCrossDelegateSc(info.to);
        require(ret == true, "to address must be in crossDelegate Sc Addrsss");

        crossOperation(eventType, info.data, from,  actualValue);
        setUniqueIDFinished(uniquID);

    }
}