

//for infura deployment uncomment from here to *************
var provider, address;

//for ropsten
var providerURL = 'https://ropsten.infura.io/apikey';

//for mainnet
//var providerURL = 'https://mainnet.infura.io/apikey';

var HDWalletProvider = require('truffle-hdwallet-provider');
// todo: Think about more secure way
var mnemonic = "to be or not to be that is the question forgot the";
// use mnemonic of wallet

provider = new HDWalletProvider(mnemonic, providerURL, 0);
address = "0x" + provider.wallet.getAddress().toString("hex");
console.log('Provider address', provider.getAddress());
console.log('Deploying to ', providerURL);
//********************


module.exports = {
   solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },

  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    
    test: {
      host: "localhost",
      port: 8545,
      network_id: "*",
    },   

    mainnet: {
    host: "127.0.0.1", 
    port: 8545,
    network_id: 1, // Ethereum network
    // optional config values:
    gas: 3000000,// CHECK GAS USED BY TESTRPC
    gasPrice: 1000000000,
    // from - default address to use for any transaction Truffle makes during migrations
    // provider - web3 provider instance Truffle should use to talk to the Ethereum network.
    //          - if specified, host and port are ignored.
   },
   ropsten: {
    //uncomment host and port for local node deploy
    //host: "127.0.0.1", 
    //port: 8545,

    network_id: 3,// Ethereum test network
    // optional config values:
    gas: 3000000,//estimanted 3M for gas CHECK GAS USED BY TESTRPC
    gasPrice: 46000000000,//check gasPrice in etherscan

    // from - default address to use for any transaction Truffle makes during migrations
    from: address,

    // provider - web3 provider instance Truffle should use to talk to the Ethereum network.
    //          - if specified, host and port are ignored.
    provider: provider
   }
  }
};
