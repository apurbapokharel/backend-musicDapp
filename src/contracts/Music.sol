pragma solidity 0.5.16;

import './DappToken.sol';

contract Musicc {
    
    string public name;
    address admin;
    DappToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;
    address currentContract;
    uint public musicCount = 0;
    mapping(uint => Music) public music;

    struct Music
    {
        uint id;
        string name;
        uint price;
        uint purchaseCount;
        address payable owner;
        string musicHash;
        string aesKey;
    }

    //events are created to make sure that receipts are obtained after a txn is completed.
    event MusicAdded
    (
        uint id,
        string name,
        uint price,
        uint purchaseCount,
        address payable owner,
        string musicHash,
        string aesKey
       
    );

     event MusicPurchased
    (
        uint id,
        string name,
        uint price,
        uint purchaseCount,
        address payable owner,
        string musicHash,
        string aesKey
       
    );

    event MusicTipped
    (
        uint id,
        string name,
        uint price,
        uint purchaseCount,
        address payable owner,
        string musicHash,
        string aesKey
       
    );

    // event Sent(address t0, address from, uint value);

    
    constructor(DappToken _tokenContract, uint256 _tokenPrice) public{
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
        name = "Music Marketplace";
    } 

    function musicAdd(string memory _name, uint _price, string memory _musicHash, string memory _aesKey) public
    {
        //Require valid name
        require(bytes(_name).length > 0);
        //Require valid price
        require(_price > 0);
        //Increment productCount
        musicCount ++;
        //Create the product
        music[musicCount] = Music(musicCount, _name, _price, 0, msg.sender,  _musicHash, _aesKey);
        //Trigger an event
        emit MusicAdded(musicCount, _name, _price, 0,  msg.sender, _musicHash, _aesKey);
    }

    function musicPurchase(uint _id) public 
    {
        //fetch product
        //memory space is being used to store copy of said product i.e copy of products[_id]
        Music memory _product = music[_id];

        //fetch owner
        address payable _seller = _product.owner;

        //check if product has valid id
        require(_product.id >0 && _product.id <= musicCount, 'product is not valid');

        //check if there is enough ether
        // require(msg.value >= _product.price);

        //check is there is enough token of the msg.sender
        require(tokenContract.balanceOf(msg.sender) >= _product.price, 'msg.sender has insufficient token');

        //check if the buyer is not the seller
        require(_seller != msg.sender, 'buyer cannot be the seller');

        uint256 _tokenPrice = _product.price;
        //pay the seller by sending ether
        //address(_seller).transfer(msg.value);

        //pay the seller by calling the transfer fucntion in Dapptoken.sol
        require(tokenContract.transfer(_seller, _tokenPrice, msg.sender), 'unable to call transfer fucntion of tokencontract');

         //increment purchaseCount
        _product.purchaseCount++; 

        //update product
        music[_id] = _product;

        //trigger an event 
        emit MusicPurchased(musicCount, _product.name, _product.price, _product.purchaseCount, _product.owner , _product.musicHash, _product.aesKey);
    } 

    function musicTip(uint _id, uint256 _tokenNumber) public 
    {
        //fetch product
        Music memory _product = music[_id];
        
        //fetch owner
        address payable _seller = _product.owner;

        //check if product is valid
        require(_product.id >0 && _product.id <= musicCount);

        //check if user has enough selected ether
        // require(msg.value ==  _price);

        //check is there is enough token of the msg.sender
        require(tokenContract.balanceOf(msg.sender) >= _tokenNumber, 'msg.sender has insufficient token');

        //pay the seller by sending ether
        // address(_seller).transfer(msg.value);

        //pay the seller by tranfering token
         require(tokenContract.transfer(_seller, _tokenNumber, msg.sender), 'unable to call transfer fucntion of tokencontract');

        //trigger an event
        emit MusicTipped(musicCount, _product.name, _product.price, _product.purchaseCount, _product.owner , _product.musicHash, _product.aesKey);

    }
}