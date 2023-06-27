pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "./BaseTxParser.sol";
import "./CrossCheck.sol";
import "./CrossLendRepay.sol";
import "./CrossLendMint.sol";
import "./CrossLib.sol";
contract Type0TxParser is BaseTxParser {
    address public crossCheckAddr;
    address public crossLendRepayAddr;
    address public crossLendMintAddr;
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

    function setDependsContractAddr(address _crossCheckAddr, address _crosssLendRepayAddr, address _crossLendMintAddr)  external {
        crossCheckAddr = _crossCheckAddr;
        crossLendRepayAddr = _crosssLendRepayAddr;
        crossLendMintAddr = _crossLendMintAddr;
    }

    function handlerTxWanLend(bytes32 uniquID, address from,  Info calldata info, uint256 chainId)  external {
        bytes32 hashBytes = hash(info);
        require(hashBytes == uniquID,"uniqueID  !== hashBytes");

        address sender = getSender(info, chainId);
        require(sender == from, "sender !== from");

        (uint tokenPairID, uint value, bytes memory crossLendToken) = CrossLib.decodeInput(info.data);

        address crossLendTokenAddr = CrossLib.bytesToAddress(crossLendToken);

        require(crossLendTokenAddr == crossLendMintAddr || crossLendTokenAddr == crossLendRepayAddr, "crossLendTokenAddr is wrong");

        (address underlyingTokenAddr, address ctokenAddr) =  CrossCheck(crossCheckAddr).getCTokenAddr(tokenPairID);

        if(crossLendTokenAddr == crossLendMintAddr){
            if(underlyingTokenAddr == 0x0000000000000000000000000000000000000000){
                CrossLendMint(crossLendMintAddr).lendWanMint(ctokenAddr,from, value);
            }else{
                CrossLendMint(crossLendMintAddr).lendTokenMint(ctokenAddr,from, value);
            }
        }else{
            if(underlyingTokenAddr == address(0x0000000000000000000000000000000000000000)){
                CrossLendRepay(crossLendMintAddr).lendWanRepay(ctokenAddr,from, value);
            }else{
                CrossLendRepay(crossLendMintAddr).lendTokenRepay(ctokenAddr,from, value);
            }
        }



    }
}