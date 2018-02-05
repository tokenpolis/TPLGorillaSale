var util = require ("./util.js");
var increaseTimeTo = util.increaseTimeTo;
var BigNumber      = util.BigNumber;
// some constants to manage amounts
const second     = 1;
const day        = 86400 * second;
const week       = day * 7;
const wei        = 1; //1 wei = 1 wei
const ether      = 1e18 * wei;
const chimp      = 1; //smallest monkey
const gorilla    = 1e18 * chimp; //larger monkey 


const OranguSale = artifacts.require('./OranguSale.sol');
const OranguToken = artifacts.require('./OranguToken.sol');

contract('OranguSale', function ([owner, wallet, investor]) {

  
  


  beforeEach(async function () {
    //set starttime 2min in the future
    this.startTime = util.latestTime() + 120 * second;
    this.endTime =   this.startTime + 1*week;
    this.afterEndTime = this.endTime + 1*second;
    this.rate = 3; //tokens per wei (espressed in smallest fractional units)
    this.maxrate = 6;
    this.minrate = 2;
    this.cap = 2*ether; //2 ether
    this.preminedOwner=owner;
    this.premined = 13 * gorilla;


    this.crowdsale = await OranguSale.new(this.startTime, 
                                          this.endTime, 
                                          this.rate, 
                                          this.maxrate,
                                          this.minrate,
                                          wallet,
                                          this.preminedOwner,
                                          this.cap, 
                                          this.premined);


    this.token      = OranguToken.at(await this.crowdsale.token());
    this.max_supply = await this.token.cap();

  });


  it('should create crowdsale with correct parameters', async function () {
    this.crowdsale.should.exist;
    this.token.should.exist;
    
    (await this.crowdsale.startTime()).should.be.bignumber.equal(this.startTime);
    (await this.crowdsale.endTime()).should.be.bignumber.equal(this.endTime);
    (await this.crowdsale.rate()).should.be.bignumber.equal(this.rate);

    (await this.crowdsale.MAXRATE()).should.be.bignumber.equal(this.maxrate);
    (await this.crowdsale.MINRATE()).should.be.bignumber.equal(this.minrate);
    (await this.crowdsale.wallet()).should.be.equal(wallet);
    (await this.crowdsale.cap()).should.be.bignumber.equal(this.cap);
    (await this.token.balanceOf(this.preminedOwner)).should.be.bignumber.equal(this.premined);

  });


  it('crowdsale should be token owner', async function () {
    const owner = await this.token.owner()
    owner.should.equal(this.crowdsale.address)
  });


  it('should accept payments and ship tokens at rate', async function () {
    const investmentAmount = 1*ether;
    const expectedTokenAmount = new BigNumber(this.rate * investmentAmount);
    console.log("expectedTokenAmount:"+expectedTokenAmount);
    let totalSupplyBefore = await this.token.totalSupply();

    (await this.crowdsale.paused()).should.be.equal(false);

    await increaseTimeTo(this.startTime);

    await this.crowdsale.buyTokens(investor, {value: investmentAmount, from: investor}).should.be.fulfilled;

    (await this.token.balanceOf(investor)).should.be.bignumber.equal(expectedTokenAmount);

    (await this.token.balanceOf(investor)).should.be.bignumber.equal(expectedTokenAmount);
    (await this.token.totalSupply()).should.be.bignumber.equal(totalSupplyBefore.add(expectedTokenAmount));
  });


  it('should reject payments during the sale if paused', async function () {
    await increaseTimeTo(this.startTime); 
    await this.crowdsale.send(1).should.be.fulfilled;
    await this.crowdsale.pause();
    (await this.crowdsale.paused()).should.be.equal(true);
    await this.crowdsale.send(1).should.be.rejected;
  });

  it('should reject buyTokens tx during the sale if paused', async function () {
    await increaseTimeTo(this.startTime); 
    await this.crowdsale.buyTokens(investor, {value: 0.1*ether, from: investor}).should.be.fulfilled;
    await this.crowdsale.pause();
    (await this.crowdsale.paused()).should.be.equal(true);
    await this.crowdsale.buyTokens(investor, {value: 0.1*ether, from: investor}).should.be.rejected;
  });

  it('should increase the balance of wallet after a buy', async function () {
    await increaseTimeTo(this.startTime); 

    let oldBalance = await web3.eth.getBalance(wallet);
    console.log("oldBalance:" + oldBalance);

    await this.crowdsale.send(1*ether).should.be.fulfilled;
    let newBalance = await web3.eth.getBalance(wallet);
    console.log("newBalance:"+newBalance);
    newBalance.should.be.bignumber.equal(oldBalance.add(1*ether)); 

  });




  it('should reject payments over cap', async function () {
    await increaseTimeTo(this.startTime);
    await this.crowdsale.send(this.cap);
    await this.crowdsale.send(1).should.be.rejected;
  });

  it('should change rate', async function () {
    await increaseTimeTo(this.startTime);
    await this.crowdsale.setRate(5);
    (await this.crowdsale.rate()).should.be.bignumber.equal(5);
  });

  it('should reject rate change from anyone not owner', async function () {
    await increaseTimeTo(this.startTime);
    await this.crowdsale.setRate(5,{from: investor}).should.be.rejected;

  });

  it('should reject change rate outside limits', async function () {
    await increaseTimeTo(this.startTime);
    await this.crowdsale.setRate(this.minrate - 1).should.be.rejected;
    await this.crowdsale.setRate(this.maxrate + 1).should.be.rejected;
    
  });


  it('should reject mint request from anyone because the sale owns the token contract', async function () {
    await increaseTimeTo(this.startTime);
    await this.token.mint(owner,1000).should.be.rejected;
    await this.token.mint(owner,1000, {from: investor}).should.be.rejected;
    
  });


  it('should reject takeTokenContract from anyone other than sale owner', async function () {
    await increaseTimeTo(this.startTime);
    await this.crowdsale.takeTokenContractOwnership({from: investor}).should.be.rejected;
  });

  it('should do takeTokenContract from sale owner', async function () {
    await increaseTimeTo(this.startTime);
    await this.crowdsale.takeTokenContractOwnership({from: owner}).should.be.fulfilled;
    (await this.token.owner()).should.be.equal(owner);
    (await this.token.balanceOf(investor)).should.be.bignumber.equal(0);
    await this.token.mint(investor,1).should.be.fulfilled;
    (await this.token.balanceOf(investor)).should.be.bignumber.equal(1);

  });


  it('shouldn\'t mint more than max_supply tokens in total', async function () {
    await increaseTimeTo(this.startTime);
    const totalSupply = await this.token.totalSupply();
    const max_supply = await this.token.max_supply();
    console.log("totalSupply:"+(totalSupply / gorilla)+" gorilla(s)");
    console.log("maxSupply:"+(max_supply / gorilla)+" gorilla(s)");

    //take Token ownership to invoke mint(...)
    await this.crowdsale.takeTokenContractOwnership({from: owner});
    await this.token.mint(owner,max_supply - totalSupply).should.be.fulfilled;
    (await this.token.balanceOf(owner)).should.be.bignumber.equal(max_supply);
    await this.token.mint(owner,1).should.be.rejected;

  });


  it('should not accept payments before start', async function () {

    await this.crowdsale.send(1 * ether).should.be.rejected;
    await this.crowdsale.buyTokens(investor, {from: investor, value: 1 * ether}).should.be.rejected;
  });

  it('should reject payments after end', async function () {
    await increaseTimeTo(this.afterEnd);
    await this.crowdsale.send(1 * ether).should.be.rejected;
    await this.crowdsale.buyTokens(investor, {value: 1 * ether, from: investor}).should.be.rejected;
  });



it('should burn tokens', async function () {
    await increaseTimeTo(this.startTime);
    const addr=await this.preminedOwner;
    const balance = await this.token.balanceOf(addr);
    console.log("balance:"+balance+ " gorilla");
    await this.token.burn(balance / 2, {from: addr});
    const newBalance = await this.token.balanceOf(addr);
    console.log("balance after burn:"+newBalance+ " gorilla");
    newBalance.should.be.bignumber.equal(balance/2);
  });




});