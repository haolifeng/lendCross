pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "./CrossLendBase.sol";
import "./Interface.sol";

contract CrossLendMint is CrossLendBase {
    function lendTokenMint(address cToken,address from,uint256  amount)  external {

        uint error = CErc20(cToken).mint(amount);
        require(error == 0);

        bool result = IERC20(cToken).transfer(from,amount);
        require(result == true);
    }
    function lendWanMint(address CWanAddr,address from, uint256 amount) external {

        CWan(CWanAddr).mint{value:amount}();
        

        bool result = IERC20(CWanAddr).transfer(from,amount);
        require(result == true);
    }
}