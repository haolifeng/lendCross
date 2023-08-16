// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;
import "./Interface.sol";
import "./CrossLib.sol";

contract CrossCheck {
    address public owner;
    address public TokenManagerAddr;
    uint256 public wanChainID = 2153201998;

    struct TokenAddrPair {
        address underlyingToken;
        address ctokenAddr;
    }
    mapping(address=>address) public UnderlyingTokenToCTokenMap;
    mapping(bytes32=>bool) public UniqueIDFinishedMap;
    mapping(address=>bool) public crossDelegateScMap;
    constructor() {
        owner = msg.sender;
    }
    modifier onlyOwner() {
        require(owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    function setCrossDeletagteSc(address scAddr) public {
        crossDelegateScMap[scAddr] = true;
    }
    function setMultiCrossDelegateSc(address[] memory scAddrs) public {
        for(uint256 i = 0; i < scAddrs.length; i++) {
            crossDelegateScMap[scAddrs[i]] = true;
        }
    }
    function checkCrossDelegateSc(address scAddr) public view returns (bool){
        return crossDelegateScMap[scAddr];
    }

    function setUniqueIDFinished(bytes32 uniqueID) public {
        UniqueIDFinishedMap[uniqueID] = true;
    }
    function checkUniqeID(bytes32 uniqueID) public view returns (bool ) {
        return UniqueIDFinishedMap[uniqueID];
    }

    function setTokenAddrPairs(TokenAddrPair[] memory tokenPairs) onlyOwner external{
        for(uint256 i = 0; i < tokenPairs.length; i++) {
            UnderlyingTokenToCTokenMap[tokenPairs[i].underlyingToken] =  tokenPairs[i].ctokenAddr;
        }

    }
    function updateTokenAddrPair(TokenAddrPair  memory tokenPair) onlyOwner external {
        UnderlyingTokenToCTokenMap[tokenPair.underlyingToken] =  tokenPair.ctokenAddr;
    }


    function getUnderlyingToken(uint tokenPairID) view public returns (bytes memory){
        (uint fromChainID, bytes memory fromAccount, uint toChainID, bytes memory toAccount) = ITokenManager(TokenManagerAddr).getTokenPairInfo(tokenPairID);

        require(fromChainID == wanChainID || toChainID == wanChainID ,"tokenPairID is wrong");

        if(fromChainID == wanChainID) {
            return fromAccount;
        }
        else {
            return toAccount;
        }
    }
    function getCTokenAddr(uint tokenPairID) view public returns (address underlyingTokenAddr, address ctokenAddr)  {
        underlyingTokenAddr = CrossLib.bytesToAddress(getUnderlyingToken(tokenPairID));
        ctokenAddr = UnderlyingTokenToCTokenMap[underlyingTokenAddr];

    }
    function setTokenManager(address tokenManagerAddr) onlyOwner external  {
        TokenManagerAddr = tokenManagerAddr;
    }
}