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
        address myAddress = address(this);
        if(myAddress.balance >= amount ){
            other.transfer(amount);
        }
    }
    function IERC20transfer(address ierc20, address recipient, uint amount) external onlyOwner returns (bool){
        IERC20 erc20 = IERC20(ierc20);
        uint256 myBalance = erc20.balanceOf(address(this));
        require(amount !=0, "amount should bigger than 0");
        require(myBalance >= amount, "balance shoud bigger than amount");
        return erc20.transfer(recipient,amount);
    }
    function IERC20Approve(address ierc20, address spender, uint amount) external onlyOwner returns (bool){
        IERC20 erc20 = IERC20(ierc20);
        return erc20.approve(spender, amount);

    }
    function IERC20Balance(address ierc20) public  view returns (uint){
        IERC20 erc20 = IERC20(ierc20);
        return erc20.balanceOf(address(this));
    }





}