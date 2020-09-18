import React, { Component } from 'react';
import Web3 from 'web3';
import Music from '../abis/Musicc.json'
import Navbar from './Navbar'
import Main from './Main'
import crypto from 'crypto-js'
import fileSaver from 'file-saver'
import Player from './Player'
import fleek from '@fleekhq/fleek-storage-js'
require('dotenv/config')
 
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host : 'ipfs.infura.io', port:5001, protocol:'https'})
console.log( process.env.REACT_APP_API_KEY,  process.env.REACT_APP_API_SECRET)

function uintToString(uintArray) {
  var decodedStr = new TextDecoder('utf-8').decode(uintArray)
  return decodedStr  
}

// function toString(words){
//   return crypto.enc.Utf8.stringify(words)
// }

// toString =  function (words) {
//   return crypto.enc.Utf8.stringify(words)
// }

function getLength() {
  var x = Math.floor((Math.random() * 10) + 5) //num between 5 and 14
  return x
}

function makeid(length) {
  var result           = ''
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

function generateAesKey() {
  var x = getLength()
  var result = makeid(x)
  return result
}

function wordToByteArray(word, length) {
  var ba = [],xFF = 0xFF
  if (length > 0)
   ba.push(word >>> 24)
  if (length > 1)
   ba.push((word >>> 16) & xFF)
  if (length > 2)
   ba.push((word >>> 8) & xFF)
  if (length > 3)
   ba.push(word & xFF)
  return ba
 }

function wordArrayToByteArray(wordArray, length) {
	if (wordArray.hasOwnProperty("sigBytes") && wordArray.hasOwnProperty("words")) {
		length = wordArray.sigBytes
    wordArray = wordArray.words
	}
  
	var result = [],bytes,i = 0
	while (length > 0) {
		bytes = wordToByteArray(wordArray[i], Math.min(4, length))
		length -= bytes.length
		result.push(bytes)
		i++
	}
  return result.flat(Infinity) 
}

class Home extends Component {

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData(){
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({account : accounts[0]})
    console.log("account is", this.state.account)
    const networkId = await web3.eth.net.getId()
    const networkData = Music.networks[networkId]
    if(networkData) {
      const contract = web3.eth.Contract(Music.abi, networkData.address)
      this.setState({contract: contract})
      this.setState({ loading : false})
      const musicCount = await contract.methods.musicCount().call()
      //Load music
      for (var i = 1; i <= musicCount; i++) {
        const music = await contract.methods.music(i).call()
        this.setState({
          products: [...this.state.products, music]
        })
      }
      // console.log(this.state.products)
    }
    else {
      window.alert('Music contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account : '',
      downloadStatus : 0,
      streamStatus : 0,
      buffer: null,
      contract: null,
      musicHash: '',
      productCount: 0,
      products: [],
      loading: true,
      decryptedByteArray : '',
      aesKey: '',
      howlSource: '',
      playerStatus: 0,
      bought: true,
      apiKey: '',
      apiSecret: '', 
    };
    //function binding
    this.createProduct = this.createProduct.bind(this) //by doing this we let react know that createProduct function is same as the props createProduct  we are passing onto the component Main located in Main.js
    this.purchaseProduct = this.purchaseProduct.bind(this)
    this.tipProduct = this.tipProduct.bind(this)
    this.togglePlayStatus = this.togglePlayStatus.bind(this)
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum) //import web3 
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  captureFile = (event) => {
    event.preventDefault() 
    const file = event.target.files[0] 
    const reader = new window.FileReader() //file reader lets web app read contents of the file asynchronously
    reader.readAsArrayBuffer(file)  //reads contents of file and when read operation is finished the loadend is triggered
    reader.onloadend = () => {
      console.time("encrypt")
      //onloadend is an event handler that represents the code to be called when the loadend event is raised
      this.setState({ buffer: Buffer(reader.result) })
      //second step encrypt
      const wordArray = crypto.lib.WordArray.create(this.state.buffer)
      const str = crypto.enc.Hex.stringify(wordArray)
      var aesKey = generateAesKey();
      this.setState({aesKey: aesKey})
      const ct = crypto.AES.encrypt(str, aesKey)
      var ctstr = ''
      ctstr = ct.toString();
      // ctstr = new Buffer(ctstr)
      ctstr = Buffer.from(ctstr)
      console.timeEnd("encrypt")
      this.setState({buffer : ctstr})
    }
  }

  // third step upload file to IPFS
  onSubmitt = (event) => {
    event.preventDefault()
    console.time("upload to ipfs")
    ipfs.add(this.state.buffer, (error, result)=> {
        // console.log('Ipfs reault', result)
        console.timeEnd("upload to ipfs")
        const musicHash = result[0].hash
        this.setState({musicHash : musicHash})
        if(error) {
          return 
        }
        if(musicHash !== ''){
          window.alert('File uploaded to IPFS press Add Product')
        }
        else{
          window.alert('File uploaded to IPFS failed')
        } 
    })
  }

  //4th step download file from ipfs using hash
  download (id){
    this.state.products.map((product,key) => {
      if(product.id.toString() === id){ //must be in string 
        console.log('inside map')
        var musicHash = product.musicHash
        var aesKey = product.aesKey
        this.setState({
          musicHash : musicHash,
          aesKey : aesKey }, ()=> {
            console.log(musicHash, aesKey);
            this.onDownload()
        })
    }
    })
  }

  onDownload = () => {
    console.time("get file");
    ipfs.get(this.state.musicHash,  (err, files) => {
      if(err){
        console.log('error are', err)
      }
        console.timeEnd("get file");
        console.log('files', files)
        this.setState({buffer : files[0].content}, ()=> {
          if(this.state.downloadStatus ===1){
            this.setState({downloadStatus : 0}) 
            this.on5thStep(this.decrypt.bind(this), this.onGetFile.bind(this))
          }
          if(this.state.streamStatus ===1){
            this.setState({streamStatus : 0}) 
            this.on5thStep(this.decrypt.bind(this), this.howlMusic.bind(this))
          }
        })
    }) 
  }

  async decrypt(){
    var str = uintToString(this.state.buffer)
    const decrypted = crypto.AES.decrypt(str, (this.state.aesKey))
    str = decrypted.toString(crypto.enc.Utf8) //convert word array to string of base utf8
    const wordArray = crypto.enc.Hex.parse(str) //c8 new word array
    var text = await wordArrayToByteArray(wordArray, wordArray.length )
    this.setState({decryptedByteArray: text})
    // console.log('decrypted byre array is', this.state.decryptedByteArray)
  }

  async on5thStep(inital, callback) {
    console.time("decrypt");     
    await inital()
    console.timeEnd("decrypt");
    callback()
  }

  howlMusic(){
    var arrayBufferView = new Uint8Array(this.state.decryptedByteArray)
    var blob = new Blob( [ arrayBufferView ], { type: 'music/mp3' } )
    var howlSource = URL.createObjectURL(blob)
    console.log('howlsource', howlSource)
    this.setState({howlSource: howlSource, playerStatus: 1})
  }

  onGetFile () {
    var arrayBufferView = new Uint8Array(this.state.decryptedByteArray)
    var blob = new Blob( [ arrayBufferView ], { type: 'music/mp3' } )
    fileSaver.saveAs(blob, 'filename.mp3')
  }

  createProduct(name, price, musicHash, aesKey) {
    // this.setState({ loading:true}) //anytime we are creating a product loading should be true
    // this.state.contract.methods.musicAdd(name, price, musicHash, aesKey).send({ from : this.state.account }) //method will expose fucntion of the SC
    // //also here we are using send because we are sending ether
    // .once('receipt',(receipt) => { //this receipt is given after a txn
    //   this.setState({ loading:false })  
    // })

    this.setState({ 
      loading:true}, () => {
        this.state.contract.methods.musicAdd(name, price, musicHash, aesKey).send({ from : this.state.account })
        this.setState({ loading:false })
      }
    )
    // window.location.reload(false)
  }
  
  purchaseProduct(id) {
    // this.setState({ loading:true}) //anytime we are creating a product loading should be true
    // await this.state.contract.methods.musicPurchase(id).send({ from : this.state.account, value: price })
    // //method will expose fucntion of the SC
    // //also here we are using send because we are sending ether
    // //value is used kinki in our test we have passed from and value parameter while sending ether 
    // .once('receipt',(receipt) => { //this receipt is given after a txn
    //   this.setState({bought: true})
    //   this.setState({ loading:false })
    //   console.log('transaction is given inside .once')
    //   console.log('bought value is', (this.state.bought))
    // })

    this.setState({ 
      loading:true}, () => {
        this.state.contract.methods.musicPurchase(id).send({ from : this.state.account })
        this.setState({ loading:false })
      }
    )  
  }

  tipProduct(id, tokenAmount){
    this.setState({ 
      loading:true}, () => {
        this.state.contract.methods.musicTip(id, tokenAmount).send({ from : this.state.account })
        this.setState({ loading:false })
      }
    ) 
  }

  downloadMusic = (id) => {
    this.setState({downloadStatus : 1})
    this.download(id)
  }

  streamMusic = (id) => {
    console.log("stream pressed");
    this.setState({streamStatus : 1})    
    this.download(id)
  }

  togglePlayStatus(){
    // this.setState({playerStatus : 0}) //cannot perform state update on an unmounted component warning aayo
    //toggle garyo bhane loop chaldina kinaki player render huna chodcha
    //call garena bhane loop na click garako bela ni loop bhaidincha
  }

  render() {
    return (
      <div>
        { 
          <div className="container-fluid mt-1"> 
            <div className="row">
              { 
                <main role="main" className="col-lg-12 d-flex">
                  { this.state.loading
                      ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                      : <Main 
                      account={this.state.account}
                      products = {this.state.products}
                      createProduct={this.createProduct}
                      purchaseProduct={this.purchaseProduct}
                      tipProduct={this.tipProduct}
                      buffer={this.state.buffer}
                      musicHash={this.state.musicHash}
                      aesKey={this.state.aesKey}
                      bought={this.state.bought}
                      captureFile={this.captureFile}
                      onSubmitt={this.onSubmitt}
                      downloadMusic={this.downloadMusic}
                      streamMusic={this.streamMusic}
                     // onStream={this.onStream}
                      decrypt={this.decrypt}
                      howlMusic={this.howlMusic}
                      /> 
                  }
                </main> 
              }
            </div>
            {
              (this.state.playerStatus == 1) ? 
                (<Player
                howlSource={this.state.howlSource}
                togglePlayStatus={this.togglePlayStatus}
                /> 
                )
              : null 
            }
          </div> 
        }
      </div>
    );
  }
}

export default Home;
