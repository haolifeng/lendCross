// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "./CrossLendBase.sol";

contract CrossLendRepay is CrossLendBase {
    function lendTokenRepay(address cToken,address underlyingTokenAddr, address from,uint256  amount) onlyTxParser external{

        uint old_underlyingBalance = IERC20(underlyingTokenAddr).balanceOf(address(this));
        require(old_underlyingBalance >= amount, "old_underlyingBalance must big than amount");
        uint error = CErc20(cToken).repayBorrowBehalf(from ,amount); //???
        require(error == 0, "repayBorrowBehalf error must be 0");

        uint new_underlyingBalance = IERC20(underlyingTokenAddr).balanceOf(address(this));
        // 安全修复：0.7 的算术不做溢出检查，先校验余额只减不增、且未超出本次还款额
        require(old_underlyingBalance >= new_underlyingBalance, "underlying balance increased unexpectedly");
        uint consumed = old_underlyingBalance - new_underlyingBalance;
        require(consumed <= amount, "consumed bigger than amount");
        if( consumed == amount){
            return;
        }
        uint leftBalance = amount - consumed;
        require(new_underlyingBalance >= leftBalance, "new_underlyingBalance must >= leftBalance");

        // 安全修复：检查返回值，避免代币返回 false 时退款静默失败
        require(IERC20(underlyingTokenAddr).transfer(from, leftBalance), "refund transfer failed");
    }
    function lendWanRepay(address CWanAddr, address from, uint256 amount) onlyTxParser external {
        uint old_WanBalance = address(this).balance;
        require(old_WanBalance >= amount, "old_wanBalance must big than amount");

        CWan(CWanAddr).repayBorrowBehalf{value:amount}(from);
        uint new_WanBalance = address(this).balance;
        // 安全修复：0.7 的算术不做溢出检查，先校验余额只减不增、且未超出本次还款额
        require(old_WanBalance >= new_WanBalance, "wan balance increased unexpectedly");
        uint consumed = old_WanBalance - new_WanBalance;
        require(consumed <= amount, "consumed bigger than amount");
        if(consumed == amount){
            return;
        }
        uint leftBalance = amount - consumed;
        require(new_WanBalance >= leftBalance, "new_underlyingBalance must >= leftBalance");

        (bool success, ) = payable(from).call{value:leftBalance}("");
        require(success, "wan refund failed");

        
    }
}