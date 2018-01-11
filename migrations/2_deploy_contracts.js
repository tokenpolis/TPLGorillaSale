
var OranguSale = artifacts.require("./OranguSale.sol");


module.exports = function(deployer,network,accounts) {

  

  if(network == "test"){
    console.log("skip all and go to testcases directly");
    return "no need to deploy in 2_deploy_contracts";
  }

  console.log("*******************************************************");
  console.log("you're deploying on live network ... ");
  console.log("network  is:"+network);
  console.log("deployer is:"+deployer);
  console.log("*******************************************************");

  //set starttime 10m in the future
  //change this with actual time
  const startTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 600; 
  console.log("starttime is:"+startTime);
  
  // Set endtime Sunday, 8 April 2018 23:59:59
  //const endTime = 1523231999; 

  //testing endtime is starttime plus 1 weeks
  const endtime = starttime + 7 * 86400;
  console.log("endTime is:"+endTime);


  //set exchange rate token-satoshi per wei
  const maxrate = 14286;
  console.log("maxrate is:"+maxrate);

  const rate = 14286;
  console.log("rate is:"+rate);

  const minrate = 3448;
  console.log("minrate is:"+minrate);

  //this must be the team wallet
  const wallet = accounts[0];
  console.log("wallet is:"+wallet);

  //this must be the team wallet
  const preminedOwner = accounts[0];
  console.log("preminedOwner is:"+preminedOwner);

  //cap in ether is 18000
  const cap = 18000 * 10**18;
  console.log("cap in ETH is:"+cap/10**18);

  //preminted are 54ml CRI  
  const premined = 54 * 10**6 * 10**18;
  console.log("premined in CRI is:"+premined/10**18);

  deployer.deploy(OranguSale, new web3.BigNumber(startTime), 
                              new web3.BigNumber(endTime), 
                              new web3.BigNumber(rate), 
                              new web3.BigNumber(maxrate), 
                              new web3.BigNumber(minrate), 
                              wallet,
                              preminedOwner,
                              cap,
                              premined);


};
