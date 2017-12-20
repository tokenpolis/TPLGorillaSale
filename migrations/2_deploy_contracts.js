
var OranguSale = artifacts.require("./OranguSale.sol");


module.exports = function(deployer,network,accounts) {

  

  if(network == "test"){
    console.log("skip all and go to testcases directly");
    return "no need to deploy in 2_deploy_contracts";
  }

  console.log("*******************************************************");
  console.log("you're deploying on live network ... ");
  console.log("network is:"+network);
  console.log("*******************************************************");

  //set starttime 2m in the future
  const startTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 120; 
  console.log("starttime is:"+startTime);
  
  // Set endtime Saturday, March 24, 2018 12:00:00 PM
  const endTime = 1521892800; 
  console.log("endTime is:"+endTime);


  //set exchange rate token-satoshi per wei
  const maxrate = 1500;
  const rate = 1000;
  const minrate = 400;

  //this must be the team wallet
  const wallet = accounts[0];

  //this must be the team wallet
  const preminedOwner = accounts[0];

  //cap in ether is 35000
  const cap = 35000 * 10**18;

  //preminted are 20ml CRI
  const premined = 20 * 10**6 * 10**18;
  

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
