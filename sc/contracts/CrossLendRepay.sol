pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "./CrossLendBase.sol";

contract CrossLendRepay is CrossLendBase {
    function lendTokenRepay(address cToken,address from,uint256  amount) onlyTxParser external{

        uint error = CErc20(cToken).repayBorrowBehalf(from ,amount); //???
        require(error == 0);

    }
    function lendWanRepay(address CWanAddr, address from, uint256 amount) onlyTxParser external {
        CWan(CWanAddr).repayBorrowBehalf{value:amount}(from);
        
    }
}