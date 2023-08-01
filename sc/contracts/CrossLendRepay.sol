pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "./CrossLendBase.sol";

contract CrossLendRepay is CrossLendBase {
    function lendTokenRepay(address cToken,address underlyingTokenAddr, address from,uint256  amount) onlyTxParser external{

        uint old_underlyingBalance = IERC20(underlyingTokenAddr).balanceOf(address(this));
        require(old_underlyingBalance >= amount, "old_underlyingBalance must big than amount");
        uint error = CErc20(cToken).repayBorrowBehalf(from ,amount); //???
        require(error == 0);

        uint new_underlyingBalance = IERC20(underlyingTokenAddr).balanceOf(address(this));
        if( old_underlyingBalance - new_underlyingBalance == amount){
            return;
        }
        uint leftBalance = amount - (old_underlyingBalance - new_underlyingBalance);
        require(new_underlyingBalance >= leftBalance, "new_underlyingBalance must >= leftBalance");

        IERC20(underlyingTokenAddr).transfer(from, leftBalance);



    }
    function lendWanRepay(address CWanAddr, address from, uint256 amount) onlyTxParser external {
        uint old_WanBalance = address(this).balance;
        require(old_WanBalance >= amount, "old_wanBalance must big than amount");

        CWan(CWanAddr).repayBorrowBehalf{value:amount}(from);
        uint new_WanBalance = address(this).balance;
        if(old_WanBalance - new_WanBalance == amount){
            return;
        }
        uint leftBalance = amount - (old_WanBalance - new_WanBalance);
        require(new_WanBalance >= leftBalance, "new_underlyingBalance must >= leftBalance");

        payable(from).transfer(leftBalance);

        
    }
}