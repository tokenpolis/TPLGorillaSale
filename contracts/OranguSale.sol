pragma solidity ^0.4.15;

import "zeppelin-solidity/contracts/crowdsale/CappedCrowdsale.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "./OranguToken.sol";


/**
 * @title OranguSale
 * @dev This is an example of crowdsale based on Zeppelin
 * Crowdsale and CappedCrowdsale and Pausable. See relevant docs
 * The way to add new features to a base crowdsale is by multiple inheritance.
 * In this example we are providing following extensions:
 * - set rate during crowdsale
 * - pause / resume crowdsale
 * - premint a number _premined of token at creation and assigns to _preminedOwner
 * - allow owner to take ownership of Token contract
 * 
 */
contract OranguSale is CappedCrowdsale,Ownable, Pausable {


  //the boundaries within rate can be set
  uint256  public MAXRATE;
  uint256  public MINRATE;



  function OranguSale(     uint256 _time_start,
                           uint256 _time_end,
                           uint256 _rate,
                           uint256 _maxrate,
                           uint256 _minrate,   
                           address _wallet,
                           address _preminedOwner,
                           uint256 _cap,
			                     uint256 _premined) public
  
  CappedCrowdsale(_cap)
  Crowdsale(_time_start, _time_end, _rate, _wallet)
  {
      MAXRATE = _maxrate;
      MINRATE = _minrate;
      require( _rate >= MINRATE);
      require( _rate <= MAXRATE);

      //uncomment and write testcase
      //require(_preminedOwner != 0x0);
      
      token.mint(_preminedOwner,_premined);
  }


  //override Crowdsale.createTokenContract()
  function createTokenContract() internal returns (MintableToken) {
    return new OranguToken();
  }

  // allows owner to set rate within boundaries
  function setRate(uint256 _rate) onlyOwner public{
    require( _rate >= MINRATE);
    require( _rate <= MAXRATE);
    rate = _rate;
  }

  //adding pause to super.buyTokens
  function buyTokens(address beneficiary) public payable whenNotPaused{
    super.buyTokens(beneficiary);
  }

  //adding pause to fallback
  function   () payable external whenNotPaused  {
    buyTokens(msg.sender);
  }

  // this function transfers the token contract ownership to sale owner
  // this is dangerous, use only if a disaster happens with this sale
  // and you want to take the contract safe out of it
  function takeTokenContractOwnership() onlyOwner public{
    token.transferOwnership(owner);
  }
  

}
