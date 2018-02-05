pragma solidity ^0.4.17;


/**
 * @title ERC20Basic
 * @dev Simpler version of ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/179
 */
contract ERC20Basic {
  function totalSupply() public view returns (uint256);
  function balanceOf(address who) public view returns (uint256);
  function transfer(address to, uint256 value) public returns (bool);
  event Transfer(address indexed from, address indexed to, uint256 value);
}


contract Airdrop{
	address[] public recipients;
	uint256[] public balances;
	ERC20Basic public token;


	function Airdrop(ERC20Basic _token) public{
		require(_token != address(0));
		token = _token;
	}

	function setRecipientsAndBalances(address[] _recipients, uint256[] _balances) public {
		require(_recipients.length == _balances.length);
		recipients = _recipients;
		balances = _balances;
	}

    function doAirdrop() public returns(uint){
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