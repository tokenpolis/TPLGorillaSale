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

  it('launch airdrop before setting recipients must fail', async function () {
    
    var recipients = ["0x01","0x02","0x03"];
    var balances   = [10, 27, 314];
    (await this.airdrop.ready()).should.be.equal(false);
    await this.airdrop.doAirdrop().should.be.rejected;
    

  });


   it('should launch airdrop', async function () {
    
    var recipients = ["0x01","0x02","0x03"];
    var balances   = [10, 27, 314];
    (await this.airdrop.ready()).should.be.equal(false);
    await this.airdrop.setRecipientsAndBalances(recipients,balances).should.be.fulfilled;
    (await this.airdrop.ready()).should.be.equal(true);
    await this.airdrop.doAirdrop().should.be.fulfilled;
    (await this.airdrop.ready()).should.be.equal(false);
    
    (await this.token.balanceOf(recipients[0])).should.be.bignumber.equal(balances[0]);
    (await this.token.balanceOf(recipients[1])).should.be.bignumber.equal(balances[1]);
    (await this.token.balanceOf(recipients[2])).should.be.bignumber.equal(balances[2]);


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
    
    //an empty array
    var a = [];
    
    //generate 100 integers and push in a
    for (i=100;i<200;i++) a.push(i);

    //generate 100 0x addresses appending the integers
    const addr = a.map(x => "0x0000000000000000000000000000000000000" + x );

    console.log(addr);

    //generate an array of balances all equal to 1000
    let balances = addr.map(x => 1000);
    console.log(balances);    

    //call the airdrop contract to set the recipients and balances
    await this.airdrop.setRecipientsAndBalances(addr,balances).should.be.fulfilled;

    //call the airdrop to finally airdrop
    let result = await this.airdrop.doAirdrop();

    //write gas on the console
    console.log("gasUsed:"+result.receipt.gasUsed);

  });



  it('the airdrop should stop after 3 users', async function () {
    
    let addr     = ["0x0000000000000000000000000000000000000001",
                    "0x0000000000000000000000000000000000000002",
                    "0x0000000000000000000000000000000000000003",
                    "0x0000000000000000000000000000000000000004"];

    let balances = [1*ether,1*ether,1*ether,1*ether];

    await this.airdrop.setRecipientsAndBalances(addr,balances).should.be.fulfilled;


    await this.airdrop.doAirdrop().should.be.fulfilled;

    (await this.airdrop.counter()).should.be.bignumber.equal(3);

    let remainder = await this.token.balanceOf(this.airdrop.address);
    console.log(remainder+"");




  });

});
