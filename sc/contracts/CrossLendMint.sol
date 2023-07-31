pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "./CrossLendBase.sol";

contract CrossLendMint is CrossLendBase {
    function lendTokenMint(address cToken,address from,uint256  amount) onlyTxParser external {

        uint256 oldBalance = CErc20(cToken).balanceOf(this);

        uint error = CErc20(cToken).mint(amount);
        require(error == 0);

        uint256 newBalance = CErc20(cToken).balanceOf(this);

        require(newBalance > oldBalance, "Mint fail");

        bool result = IERC20(cToken).transfer(from,newBalance-oldBalance);
        require(result == true);
    }
    function lendWanMint(address CWanAddr,address from, uint256 amount) onlyTxParser external {

        uint256 oldBalance = CWan(CWanAddr).balanceOf(this);

        CWan(CWanAddr).mint{value:amount}();
        uint256 newBalance = CWan(CWanAddr).balanceOf(this);
        require(newBalance > oldBalance, "Mint fail");
        bool result = IERC20(CWanAddr).transfer(from,newBalance-oldBalance);
        require(result == true);
    }
}