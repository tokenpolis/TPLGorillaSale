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
contract('Airdrop', function ([owner, other]) {

    beforeEach(async function () {
    this.token      = await OranguToken.new();
    console.log("token at:"+this.token.address);
    this.airdrop    = await Airdrop.new(this.token.address);
    console.log("airdrop at:"+this.airdrop.address);
    await this.token.mint(this.airdrop.address, 3.14 * 10**18);
  });


  it('should create airdrop with correct parameters', async function () {
    
    this.token.should.exist;
    this.airdrop.should.exist;
    (await this.token.balanceOf(this.airdrop.address)).should.be.bignumber.equal(3.14 * 10**18);

  });

  it('should set recipients and balances', async function () {
    
    let addr     = ["0x0000000000000000000000000000000000000001",
                    "0x0000000000000000000000000000000000000002",
                    "0x0000000000000000000000000000000000000003"];

    let balances = [1000,2000,3000];

    await this.airdrop.setRecipientsAndBalances(addr,balances, {from:other}).should.be.rejected;
    await this.airdrop.setRecipientsAndBalances(addr,balances).should.be.fulfilled;
    
    (await this.airdrop.recipients(0)).should.be.equal(addr[0]);
    (await this.airdrop.balances(0)).should.be.bignumber.equal(balances[0]);

    (await this.airdrop.recipients(1)).should.be.equal(addr[1]);
    (await this.airdrop.balances(1)).should.be.bignumber.equal(balances[1]);

    (await this.airdrop.recipients(2)).should.be.equal(addr[2]);
    (await this.airdrop.balances(2)).should.be.bignumber.equal(balances[2]);

  });

  it('should do the airdrop', async function () {
    
    let addr     = ["0x0000000000000000000000000000000000000001",
                    "0x0000000000000000000000000000000000000002",
                    "0x0000000000000000000000000000000000000003"];
    let balances = [1000,2000,3000];

    await this.airdrop.setRecipientsAndBalances(addr,balances).should.be.fulfilled;

    await this.airdrop.doAirdrop({from:other}).should.be.rejected;
    await this.airdrop.doAirdrop().should.be.fulfilled;
    (await this.token.balanceOf(addr[0])).should.be.bignumber.equal(balances[0]);
    (await this.token.balanceOf(addr[1])).should.be.bignumber.equal(balances[1]);
    (await this.token.balanceOf(addr[2])).should.be.bignumber.equal(balances[2]);
  });


  it('should do massive airdrop to cause gas issues', async function () {
    
    var a = [];

    for (i=100;i<200;i++) a.push(i);
    // pass a function to map
    const addr = a.map(x => "0x0000000000000000000000000000000000000" + x );

    console.log(addr);

    let balances = addr.map(x => 1000);
    console.log(balances);    


    await this.airdrop.setRecipientsAndBalances(addr,balances).should.be.fulfilled;

    await this.airdrop.doAirdrop({from:other}).should.be.rejected;
    let result = await this.airdrop.doAirdrop();
    console.log("gasUsed:"+result.receipt.gasUsed);

  });


});
