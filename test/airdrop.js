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
    console.log("token:"+this.token.address);
    this.airdrop    = await Airdrop.new(this.token.address);
    await this.token.mint(this.airdrop.address, 3.14 * 10**18);
  });


  it('should create airdrop with correct parameters', async function () {
    
    this.token.should.exist;
    this.airdrop.should.exist;
    (await this.token.balanceOf(this.airdrop.address)).should.be.bignumber.equal(3.14 * 10**18);

  });

  it('should launch airdrop', async function () {
    
    var recipients = ["0x01","0x02","0x03"];
    var balances   = [10, 27, 314];
    await this.airdrop.setRecipientsAndBalances(recipients,balances).should.be.fulfilled;
    await this.airdrop.doAirdrop().should.be.fulfilled;

    (await this.token.balanceOf(recipients[0])).should.be.bignumber.equal(balances[0]);
    (await this.token.balanceOf(recipients[1])).should.be.bignumber.equal(balances[1]);
    (await this.token.balanceOf(recipients[2])).should.be.bignumber.equal(balances[2]);


  });

});
