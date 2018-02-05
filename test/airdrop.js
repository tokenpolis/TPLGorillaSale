var util = require ("./util.js");
var increaseTimeTo = util.increaseTimeTo;
var BigNumber      = util.BigNumber;

// some constants to manage amounts
const second     = 1;
const day        = 86400 * second;
const week       = day * 7;
const wei        = 1; //1 wei = 1 wei
const ether      = 1e18 * wei;

 

const OranguToken = artifacts.require('./OranguToken.sol');
const Airdrop     = artifacts.require('./Airdrop.sol');
contract('Airdrop', function ([owner, wallet, investor]) {

    beforeEach(async function () {
    this.token      = await OranguToken.new();
    this.airdrop    = await Airdrop.new(this.token);
    await this.token.mint(this.airdrop, 3.14 * 10**18);
  });


  it('should create airdrop with correct parameters', async function () {
    
    this.token.should.exist;
    this.airdrop.should.exist;
    (await this.token.balanceOf(this.airdrop)).should.be.bignumber.equal(3.14 * 10**18);

  });

});
