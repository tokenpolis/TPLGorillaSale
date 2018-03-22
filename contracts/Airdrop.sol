pragma solidity ^0.4.17;


import "zeppelin-solidity/contracts/token/ERC20Basic.sol";


contract Airdrop{
	address[] public recipients;
	uint256[] public balances;
	ERC20Basic public token;
  address owner;

  //check this counter to know how many recipients got the Airdrop
  uint256 public counter=0;

  bool public ready=false;

	function Airdrop(address _token) public{
		require(_token != address(0));
		token = ERC20Basic(_token);
    owner = msg.sender;
	}

	function setRecipientsAndBalances(address[] _recipients, uint256[] _balances) public {
		require(_recipients.length == _balances.length);
    require(msg.sender == owner);
    require(ready == false);
		recipients = _recipients;
		balances = _balances;
    ready=true;
	}

    function doAirdrop() public returns(uint){
      require(msg.sender == owner);
    	require(recipients.length>0);
      require (ready == true);

    	for(uint i=0; i < recipients.length; i++){
    		if(token.balanceOf(this)>=balances[i]){
    			token.transfer(recipients[i],balances[i]);
          counter ++;
    		}
    		else{
          ready=false;
    			return i;

    		}
    	}
      ready=false;
    	return recipients.length;
    }

}