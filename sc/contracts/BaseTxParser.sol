// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;
import "./external_lib/RLPEncode.sol";
import "./external_lib/ECVerify.sol";
import "./CrossLib.sol";
import "./CrossCheck.sol";
import "./CrossLendRepay.sol";
import "./CrossLendMint.sol";
contract BaseTxParser {

    struct AccessListItem {
        address addressK;
        bytes32[]  storageKey;
    }
    address public owner;
    address public crossCheckAddr;
    address payable public crossLendRepayAddr;
    address payable public crossLendMintAddr;

    constructor() {
        owner = msg.sender;
    }
    modifier onlyOwner() {
        require(owner == msg.sender, "Ownable: caller is not the owner");
        _;
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

    function setDependsContractAddr(address _crossCheckAddr, address _crossLendRepayAddr, address _crossLendMintAddr) onlyOwner external {
        crossCheckAddr = _crossCheckAddr;
        crossLendRepayAddr = payable(_crossLendRepayAddr);
        crossLendMintAddr = payable(_crossLendMintAddr);
    }
    function setDependCrossCheckAddr(address _crossCheckAddr) onlyOwner external {
        crossCheckAddr = _crossCheckAddr;
    }
    function setDependLendRepayAddr(address _crossLendRepayAddr) onlyOwner external {
        crossLendRepayAddr = payable(_crossLendRepayAddr);
    }
    function setDependLendMintAddr(address _crossLendMintAddr) onlyOwner external {
        crossLendMintAddr = payable(_crossLendMintAddr);
    }

    function userLock_decodeInput(bytes calldata data) public  pure returns(uint tokenPairID, uint value, bytes memory crossLendToken) {
        ( tokenPairID,  value,   crossLendToken) = CrossLib.userLock_decodeInput(data);
    }
    function userBurn_decodeInput(bytes calldata data) public pure returns(uint tokenPairID, uint value, bytes memory crossLendToken) {
        ( tokenPairID,  value,   crossLendToken) = CrossLib.userBurn_decodeInput(data);
    }
    function bytesToAddress(bytes memory crossLendToken) public   pure returns (address crossLendTokenAddr) {
        crossLendTokenAddr = CrossLib.bytesToAddress(crossLendToken);
    }

    function getCTokenAddr(uint tokenPairID) public view returns (address underlyingTokenAddr, address ctokenAddr) {
        ( underlyingTokenAddr,  ctokenAddr) =  CrossCheck(crossCheckAddr).getCTokenAddr(tokenPairID);
    }
    function setUniqueIDFinished(bytes32 uniqueID) public {
        CrossCheck(crossCheckAddr).setUniqueIDFinished(uniqueID);
    }
    function  checkUniqeID(bytes32 uniqueID) public view returns (bool){
        return CrossCheck(crossCheckAddr).checkUniqeID(uniqueID);
    }
    function checkCrossDelegateSc(address scAddr) public view returns (bool){
        return  CrossCheck(crossCheckAddr).checkCrossDelegateSc(scAddr);
    }

    function crossOperation(uint eventType, bytes calldata data, address from, uint actualValue) internal   {
        require(eventType == 1 || eventType == 2, "eventType is not 1 or 2");
        uint tokenPairID;
        bytes memory crossLendToken;

        if(eventType == 1){
            ( tokenPairID, ,   crossLendToken) = userLock_decodeInput(data);
        }else if(eventType == 2) {
            ( tokenPairID, ,   crossLendToken) = userBurn_decodeInput(data);
        }
        address crossLendTokenAddr = bytesToAddress(crossLendToken);

        //

        require(crossLendTokenAddr == crossLendMintAddr || crossLendTokenAddr == crossLendRepayAddr, "crossLendTokenAddr is wrong");

        (address underlyingTokenAddr, address ctokenAddr) =  getCTokenAddr(tokenPairID);

        if(crossLendTokenAddr == crossLendMintAddr){
            if(underlyingTokenAddr == 0x0000000000000000000000000000000000000000){
                CrossLendMint(crossLendMintAddr).lendWanMint(ctokenAddr,from, actualValue);
            }else{
                CrossLendMint(crossLendMintAddr).lendTokenMint(ctokenAddr,underlyingTokenAddr,from, actualValue);
            }
        }else{
            if(underlyingTokenAddr == address(0x0000000000000000000000000000000000000000)){
                CrossLendRepay(crossLendRepayAddr).lendWanRepay(ctokenAddr,from, actualValue);
            }else{
                CrossLendRepay(crossLendRepayAddr).lendTokenRepay(ctokenAddr,underlyingTokenAddr,from, actualValue);
            }
        }
    }

}