pragma solidity ^0.4.15;

import "zeppelin-solidity/contracts/token/CappedToken.sol";
import "zeppelin-solidity/contracts/token/BurnableToken.sol";

/**
 * @title OranguToken
 * @dev Very simple ERC20 Token, capped and minted.
 * It is meant to be used in a OranguSale crowdsale contract.
 */
contract OranguToken is CappedToken, BurnableToken {

  string  public constant name            = "Use your Name"; //remove "(test)" in production
  string  public constant symbol          = "$£€";
  uint8   public constant decimals        = 18;
  uint256 public constant max_supply      = 21000000 * 10**18;//21mo and 18 decimals

  function OranguToken() CappedToken(max_supply) public  {} 


}