// const Music = artifacts.require("Musicc");
// var DappTokenSale = artifacts.require("DappTokenSale");
// var DappToken = artifacts.require("DappToken");

// require('chai')
//     .use(require('chai-as-promised'))
//     .should()

// contract('Music', ([deployer, seller, buyer]) => {
//     let music

//     before(async() => {
//         music = await Music.deployed()
//     })

//     describe('deployment',async() =>{
//         it('deploys successfully', async() => {
//         //music = await music.deployed() we add before so we dont need to use this command everytime in every describe
//         const address = music.address
//         assert.notEqual(address, 0x0)
//         assert.notEqual(address, '')
//         assert.notEqual(address, null)
//         assert.notEqual(address, undefined)
//         })

//         it('has a name', async()=>{
//             const name = await music.name()
//             assert.equal(name, 'Music Marketplace')
            
//         })
//     })

//     describe('products', async()=> {
//         let musicCount, result

//         before(async()=>{
//             result = await music.musicAdd('haha sound',250,'0xmusicHash', 'aeskey', {from: seller})
//             musicCount = await music.musicCount()
//         })
//         //c8 product
//         it('creates product', async()=>{
//             //success
//             assert.equal(musicCount,1)
//             const event = result.logs[0].args
//             assert.equal(event.id.toNumber(), musicCount.toNumber(), 'id is correct')
//             assert.equal(event.name ,'haha sound')
//             assert.equal(event.price,'250' , 'price is correct')
//             assert.equal(event.purchaseCount ,'0', 'purchase count is correct')
//             assert.equal(event.owner, seller, 'owner address is correct')
//             assert.equal(event.musicHash, '0xmusicHash', 'music hash is correct')
//             assert.equal(event.aesKey, 'aeskey', 'aes key is correct')



//             //Failure 
//             //Music muust have a name
//             await await music.musicAdd('', web3.utils.toWei('1','Ether'),'0xmusicHash', 'aeskey', {from: seller}).should.be.rejected;
//             //Music must have a price
//             await await music.musicAdd('Haha sound', 0,'0xmusicHash', 'aeskey', {from: seller}).should.be.rejected;
//             //Music must have musicHash
//             //Music must have aeskey

//         })

//         //list product
//         it('lists products', async()=> {
//             const product = await music.music(musicCount)
//             assert.equal(product.id.toNumber(), musicCount.toNumber(), 'id is correct')
//             assert.equal(product.name ,'haha sound')
//             assert.equal(product.price,'250' , 'price is correct')
//             assert.equal(product.purchaseCount ,'0', 'purchase count is correct')
//             assert.equal(product.owner, seller, 'owner address is correct')
//             assert.equal(product.musicHash, '0xmusicHash', 'music hash is correct')
//             assert.equal(product.aesKey, 'aeskey', 'aes key is correct')

            
//         })

//         // it('calls tokenTransfer successfully', async() => {
//         //     let tokenInstance
//         //     await DappToken.deployed().then(function(instance){
//         //         tokenInstance = instance ;
//         //     })

//         //     let oldSellerBalance 
//         //     await tokenInstance.balanceOf(seller).then(function(balance){
//         //         oldSellerBalance = balance 
//         //     })

//         //     tokenInstance.transfer(seller, 250, buyer).then(function(receipt){
//         //         tReceipt = receipt
//         //         result = tReceipt.logs[0].args
//         //     })

//         //     let newSellerBalance 
//         //     await tokenInstance.balanceOf(seller).then(function(balance){
//         //         newSellerBalance = balance
//         //     })

//         //     let price
//         //     price = 250
//         //     price = new web3.utils.BN(price)
//         //     const expectedBalance = oldSellerBalance.add(price) //add is a function we can use for BN

//         //     assert.equal(newSellerBalance.toString(), expectedBalance.toString())
//         // })
       
//         //sells product
//         it('sells products', async()=> {
//             //track seller balance before purchase
//             let tokenInstance
//             let result
//             await DappToken.deployed().then(function(instance){
//                 tokenInstance = instance ;
//                 tokenInstance.transfer(buyer, 1000, deployer, {from: deployer})
//             }).then(function(receipt){
//                // assert.equal(receipt.logs[0].args._value, 1000, 'tokens transfered')
//             })
//             // oldSellerBalance = await web3.eth.getBalance(seller)
//             // oldSellerBalance = new web3.utils.BN(oldSellerBalance) //use new whenever we use BN or create a BN .We cannot understand BN on seeing it.
//             let oldSellerBalance 
//             await tokenInstance.balanceOf(seller).then(function(balance){
//                 oldSellerBalance = balance 
//             })
//             //oldSellerBalance = oldSellerBalance.toNumber()
//             //success buyer makes purchase
//             // result = await music.musicPurchase(musicCount, {from : buyer ,value: web3.utils.toWei('1','Ether')})
//             result = await music.musicPurchase(musicCount, {from : buyer ,value: 10 * 1000000000000000})

//             //check logs
//             const event = result.logs[0].args
//             assert.equal(event.id.toNumber(), musicCount.toNumber(), 'id is correct')
//             assert.equal(event.name ,'haha sound')
//             assert.equal(event.price,'250' , 'price is correct')
//             assert.equal(event.purchaseCount ,'1', 'purchase count is correct')
//             assert.equal(event.owner, seller, 'owner address is correct')
//             assert.equal(event.musicHash, '0xmusicHash', 'music hash is correct')
//             assert.equal(event.aesKey, 'aeskey', 'aes key is correct')
            
//             //check seller receives fund
//             let newSellerBalance 
//             // newSellerBalance = await web3.eth.getBalance(seller)
//             // newSellerBalance = new web3.utils.BN(newSellerBalance)
//             await tokenInstance.balanceOf(seller).then(function(balance){
//                 newSellerBalance = balance
//             })
//             //newSellerBalance = newSellerBalance.toNumber()

//             let price
//             price = 250
//             price = new web3.utils.BN(price)
//             const expectedBalance = oldSellerBalance.add(price) //add is a function we can use for BN

//             //assert.equal(newSellerBalance.toString(), expectedBalance.toString())

//             //Failure 
//             //try to buy a product that doenst not exist
//             // await music.musicPurchase(99, {from : buyer ,value: web3.utils.toWei('1','Ether')}).should.be.rejected
            
//             //using insufficient ether
//             // await music.musicPurchase(musicCount, {from : buyer ,value: web3.utils.toWei('0.5','Ether')}).should.be.rejected

//             // //deployer tries to buy the product i.e product cant be purchased twice
//             // await music.musicPurchase(musicCount, {from : deployer ,value: web3.utils.toWei('1','Ether')}).should.be.rejected

//             // //buyer tries to buy the product twice
//             // await music.musicPurchase(musicCount, {from : buyer ,value: web3.utils.toWei('1','Ether')}).should.be.rejected

//             //since music can be purchased by multiple buyers so the last two failure cases are not applicable here as there is no propert purchased in out struct music
            
//         })

//         //tip product
//         // it('tips products', async()=> {
//         //     //track seller balance before purchase
//         //     let oldSellerBalance 
//         //     oldSellerBalance = await web3.eth.getBalance(seller)
//         //     oldSellerBalance = new web3.utils.BN(oldSellerBalance) //use new whenever we use BN or create a BN .We cannot understand BN on seeing it.

//         //     //success buyer makes purchase
//         //     //I am using quotation in price as the price variable is uint256 but we use JSON to parse the argument and JS only supports 2^53-1
//         //     result = await music.musicTip(musicCount, '1000000000000000000', {from : buyer ,value: web3.utils.toWei('1','Ether')})
//         //     //check logs
//         //     const event = result.logs[0].args
//         //     assert.equal(event.id.toNumber(), musicCount.toNumber(), 'id is correct')
//         //     assert.equal(event.name ,'haha sound')
//         //     assert.equal(event.price,'1000000000000000000' , 'price is correct')
//         //     assert.equal(event.purchaseCount ,'1', 'purchase count is correct') //1 as test product already purchased above
//         //     assert.equal(event.owner, seller, 'owner address is correct')
//         //     assert.equal(event.musicHash, '0xmusicHash', 'music hash is correct')
//         //     assert.equal(event.aesKey, 'aeskey', 'aes key is correct')
            
//         //     //check seller receives fund
//         //     let newSellerBalance 
//         //     newSellerBalance = await web3.eth.getBalance(seller)
//         //     newSellerBalance = new web3.utils.BN(newSellerBalance)

//         //     let price
//         //     price = web3.utils.toWei('1', 'Ether')
//         //     price = new web3.utils.BN(price)

//         //     const expectedBalance = oldSellerBalance.add(price) //add is a function we can use for BN

//         //     assert.equal(newSellerBalance.toString(), expectedBalance.toString())

//         //     //Failure 
//         //     //try to tip a product that doenst not exist
//         //     await music.musicTip(99, '1000000000000000000', {from : buyer ,value: web3.utils.toWei('1','Ether')}).should.be.rejected
            
//         //     //using insufficient ether
//         //     await music.musicTip(musicCount, '1000000000000000000', {from : buyer ,value: web3.utils.toWei('0.5','Ether')}).should.be.rejected

//         // })
//     })     
// })