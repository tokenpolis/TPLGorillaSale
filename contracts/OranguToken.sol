pragma solidity ^0.4.15;

import "zeppelin-solidity/contracts/token/CappedToken.sol";

/**
 * @title OranguToken
 * @dev Very simple ERC20 Token, capped and minted.
 * It is meant to be used in a crowdsale contract.
 */
contract OranguToken is CappedToken {

  string  public constant name            = "Crip.token(test)";
  string  public constant symbol          = "CRI";
  uint8   public constant decimals        = 18;
  uint256 public constant max_supply      = 50000000 * 10**18;//50ml and 18 decimals

  function OranguToken() CappedToken(max_supply) public  {} 


}