pragma solidity ^0.4.17;


import "zeppelin-solidity/contracts/token/ERC20Basic.sol";


contract Airdrop{
	address[] public recipients;
	uint256[] public balances;
	ERC20Basic public token;
  address owner;


	function Airdrop(address _token) public{
		require(_token != address(0));
		token = ERC20Basic(_token);
    owner = msg.sender;
	}

	function setRecipientsAndBalances(address[] _recipients, uint256[] _balances) public {
		require(_recipients.length == _balances.length);
    require(msg.sender == owner);
		recipients = _recipients;
		balances = _balances;
	}

    function doAirdrop() public returns(uint){
      require(msg.sender == owner);
    	require(recipients.length>0);
    	for(uint i=0; i < recipients.length; i++){
    		if(token.balanceOf(this)>=balances[i]){
    			token.transfer(recipients[i],balances[i]);
    		}
    		else{
    			return i;
    		}
    	}
    	return recipients.length;
    }

}