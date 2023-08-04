// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

//ERC20 interface
interface IERC20 {
    function totalSupply() external view returns (uint);
    function balanceOf(address account) external view returns (uint);
    function transfer(address recipient, uint amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint);
    function approve(address spender, uint amount) external returns (bool);
    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);
}

//Compound cERC20 interface
interface CErc20 {
    function balanceOf(address) external view returns (uint);
    function mint(uint) external returns (uint);
    function exchangeRateCurrent() external returns (uint);
    function supplyRatePerBlock() external returns (uint);
    function balanceOfUnderlying(address) external returns (uint);
    function redeem(uint) external returns (uint);
    function redeemUnderlying(uint) external returns (uint);
    function borrow(uint) external returns (uint);
    function borrowBalanceCurrent(address) external returns (uint);
    function borrowRatePerBlock() external view returns (uint);
    function repayBorrow(uint) external returns (uint);
    function repayBorrowBehalf(address borrower, uint repayAmount) external returns (uint);
    function liquidateBorrow(
        address borrower,
        uint amount,
        address collateral
    ) external returns (uint);
    function borrowBalanceStored(address account) external view returns (uint);
}

//Compound CETH interface
interface CWan {
    function balanceOf(address) external view returns (uint);
    function mint() external payable;
    function exchangeRateCurrent() external returns (uint);
    function supplyRatePerBlock() external returns (uint);
    function balanceOfUnderlying(address) external returns (uint);
    function redeem(uint) external returns (uint);
    function redeemUnderlying(uint) external returns (uint);
    function borrow(uint) external returns (uint);
    function borrowBalanceCurrent(address) external returns (uint);
    function borrowRatePerBlock() external view returns (uint);
    function repayBorrow() external payable;
    function liquidateBorrow(address borrower, address cTokenCollateral) external payable;
    function repayBorrowBehalf(address borrower) external payable;
    function borrowBalanceStored(address account) external view returns (uint);
}

interface  ITokenManager {
    function getTokenPairInfo(uint id) external view returns (uint fromChainID, bytes memory fromAccount, uint toChainID, bytes memory toAccount);
}