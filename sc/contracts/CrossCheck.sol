// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;
import "./Interface.sol";
import "./CrossLib.sol";

contract CrossCheck {
    address public owner;
    address public TokenManagerAddr;
    uint256 public wanChainID = 2153201998;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event CrossDelegateScSet(address indexed scAddr, bool allowed);
    event UniqueIDFinished(bytes32 indexed uniqueID);
    event ParserSet(address indexed parser, bool allowed);
    event TokenManagerSet(address indexed tokenManagerAddr);
    event TokenAddrPairSet(address indexed underlyingToken, address indexed ctokenAddr);

    struct TokenAddrPair {
        address underlyingToken;
        address ctokenAddr;
    }
    mapping(address=>address) public UnderlyingTokenToCTokenMap;
    mapping(bytes32=>bool) public UniqueIDFinishedMap;
    mapping(address=>bool) public crossDelegateScMap;
    // 已授权的 TxParser 合约（owner 只能是一个地址，而 TxParser 有三个，
    // 不能靠 transferOwnership 把 owner 转给合约，否则 owner 将失去管理权）
    mapping(address=>bool) public parserMap;
    constructor() {
        owner = msg.sender;
    }
    modifier onlyOwner() {
        require(owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    // 安全修复：转移所有权，避免 owner 私钥泄露后无法转移控制权
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "new owner is the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    // 安全修复：加入 onlyOwner，防止任意地址把恶意合约加入白名单
    function setCrossDeletagteSc(address scAddr) public onlyOwner {
        crossDelegateScMap[scAddr] = true;
        emit CrossDelegateScSet(scAddr, true);
    }
    // 安全修复：加入 onlyOwner
    function setMultiCrossDelegateSc(address[] memory scAddrs) public onlyOwner {
        for(uint256 i = 0; i < scAddrs.length; i++) {
            crossDelegateScMap[scAddrs[i]] = true;
            emit CrossDelegateScSet(scAddrs[i], true);
        }
    }
    // 安全修复：支持撤销白名单地址，便于误配置/私钥泄露时应急处置
    function delCrossDeletagteSc(address scAddr) public onlyOwner {
        crossDelegateScMap[scAddr] = false;
        emit CrossDelegateScSet(scAddr, false);
    }
    function delMultiCrossDelegateSc(address[] memory scAddrs) public onlyOwner {
        for(uint256 i = 0; i < scAddrs.length; i++) {
            crossDelegateScMap[scAddrs[i]] = false;
            emit CrossDelegateScSet(scAddrs[i], false);
        }
    }
    function checkCrossDelegateSc(address scAddr) public view returns (bool){
        return crossDelegateScMap[scAddr];
    }

    // 安全修复：授权/撤销 TxParser 合约标记 uniqueID 已处理（可撤销，owner 保留管理权）
    function setParser(address parser, bool allowed) external onlyOwner {
        require(parser != address(0), "parser is the zero address");
        parserMap[parser] = allowed;
        emit ParserSet(parser, allowed);
    }

    // 安全修复：加入 onlyOwner，防止攻击者预占 uniqueID 阻断合法跨链交易；
    // 同时只允许 owner 或已授权的 TxParser 调用，避免授权被滥用
    function setUniqueIDFinished(bytes32 uniqueID) public {
        require(msg.sender == owner || parserMap[msg.sender], "CrossCheck: caller is not authorized");
        UniqueIDFinishedMap[uniqueID] = true;
        emit UniqueIDFinished(uniqueID);
    }
    function checkUniqeID(bytes32 uniqueID) public view returns (bool ) {
        return UniqueIDFinishedMap[uniqueID];
    }
    function setTokenAddrPairs(TokenAddrPair[] memory tokenPairs) onlyOwner external{
        for(uint256 i = 0; i < tokenPairs.length; i++) {
            UnderlyingTokenToCTokenMap[tokenPairs[i].underlyingToken] =  tokenPairs[i].ctokenAddr;
            emit TokenAddrPairSet(tokenPairs[i].underlyingToken, tokenPairs[i].ctokenAddr);
        }

    }
    function updateTokenAddrPair(TokenAddrPair  memory tokenPair) onlyOwner external {
        UnderlyingTokenToCTokenMap[tokenPair.underlyingToken] =  tokenPair.ctokenAddr;
        emit TokenAddrPairSet(tokenPair.underlyingToken, tokenPair.ctokenAddr);
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
        // 安全修复：防止误传零地址导致跨链取款校验失效
        require(tokenManagerAddr != address(0), "tokenManagerAddr is the zero address");
        TokenManagerAddr = tokenManagerAddr;
        emit TokenManagerSet(tokenManagerAddr);
    }
}