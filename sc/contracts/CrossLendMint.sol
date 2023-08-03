pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "./CrossLendBase.sol";

contract CrossLendMint is CrossLendBase {
    function lendTokenMint(address cToken,address underlyingTokenAddr, address from,uint256  amount) onlyTxParser external {

        uint old_underlyingBalance = IERC20(underlyingTokenAddr).balanceOf(address(this));
        require(old_underlyingBalance >= amount, "old_underlyingBalance must big than amount");

        uint256 oldBalance = CErc20(cToken).balanceOf(address(this));

        uint error = CErc20(cToken).mint(amount);
        require(error == 0,"error must be 0");

        uint256 newBalance = CErc20(cToken).balanceOf(address(this));

        require(newBalance > oldBalance, "Mint fail");

        bool result = IERC20(cToken).transfer(from,newBalance-oldBalance);
        require(result == true);
    }
    function lendWanMint(address CWanAddr,address from, uint256 amount) onlyTxParser external {
        uint old_WanBalance = address(this).balance;
        require(old_WanBalance >= amount, "old_wanBalance must big than amount");

        uint256 oldBalance = CWan(CWanAddr).balanceOf(address(this));

        CWan(CWanAddr).mint{value:amount}();
        uint256 newBalance = CWan(CWanAddr).balanceOf(address(this));
        require(newBalance > oldBalance, "Mint fail");
        bool result = IERC20(CWanAddr).transfer(from,newBalance-oldBalance);
        require(result == true);
    }
}