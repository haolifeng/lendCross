// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "./Interface.sol";
contract CrossLendBase {
    address public owner;
    mapping(address=>bool) public  txParserMap;

    constructor() {
        owner = msg.sender;
    }
    receive() external payable {  }
    modifier onlyOwner() {
        require(owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }
    modifier onlyTxParser() {
        require(txParserMap[msg.sender] == true, "tx is not allow");
        _;
    }

    function setTxParse(address txAddr) external onlyOwner {
        txParserMap[txAddr] = true;
    }
    function delTxParse(address txAddr) external onlyOwner {
        txParserMap[txAddr] = false;
    }
    function setTxMulParse(address[] calldata txAddrs) external onlyOwner {
        for(uint256 i = 0; i < txAddrs.length; i++){
            txParserMap[txAddrs[i]] = true;
        }
    }

    function sendWan(address payable other,uint amount) public onlyOwner {
        require(other != address(0), "recipient is the zero address");
        // 安全修复：transfer 只附带 2300 gas，收款方是多签/合约钱包时会失败；
        // 改用 call 并显式检查结果，同时余额不足时直接回滚，避免静默不执行
        require(address(this).balance >= amount, "insufficient wan balance");
        (bool success, ) = other.call{value:amount}("");
        require(success, "send wan failed");
    }
    function IERC20transfer(address ierc20, address recipient, uint amount) external onlyOwner returns (bool){
        IERC20 erc20 = IERC20(ierc20);
        uint256 myBalance = erc20.balanceOf(address(this));
        require(amount !=0, "amount should bigger than 0");
        require(myBalance >= amount, "balance shoud bigger than amount");
        // 安全修复：检查代币返回值，避免转账失败被静默忽略
        require(erc20.transfer(recipient,amount), "erc20 transfer failed");
        return true;
    }
    function IERC20Approve(address ierc20, address spender, uint amount) external onlyOwner returns (bool){
        IERC20 erc20 = IERC20(ierc20);
        // 安全修复：检查代币返回值，避免授权失败被静默忽略
        require(erc20.approve(spender, amount), "erc20 approve failed");
        return true;
    }
    function IERC20Balance(address ierc20) public  view returns (uint){
        IERC20 erc20 = IERC20(ierc20);
        return erc20.balanceOf(address(this));
    }





}