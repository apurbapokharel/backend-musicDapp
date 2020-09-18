import React, { Component } from 'react';

class Main extends Component {

  render() {
    return (
      <div id="content">
        <h1>Add Product</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.productName.value 
          const price = this.productPrice.value
          const musicHash = this.props.musicHash
          const aesKey = this.props.aesKey
          if(this.props.memeHash !== ''){
            this.props.createProduct(name, price, musicHash, aesKey) //we are calling the function in App.js which calls the fucntion in the SC
          } else {
            window.alert('Please upload file to IPFS first')
          }
          
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="productName"
              type="text"
              ref={(input) => { this.productName = input }} //react manages the value of form elements using ref
              className="form-control"
              placeholder="Product Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productPrice"
              type="text"
              ref={(input) => { this.productPrice = input }}
              className="form-control"
              placeholder="Product Price in DAPP"
              required />
          </div>
          <div className="form-group mr-sm-2 ">
            <input
              type="file"
              className="form-control "
              placeholder="Select product"
              onChange={this.props.captureFile}
              required />
            <input 
              type="button"
              className="form-control"
              value="Upload file to IPFS"
              placeholder="memeHash" 
              onClick={this.props.onSubmitt}
              />
          </div>
          <button type="submit" className="btn btn-primary">Add Product</button>
        </form>
        <p>&nbsp;</p>
        <h2>Buy Product</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col"></th> 
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            { this.props.products.map((product,key) => { 
                return(
                  // we assign a key to each row elements..this is required by react so as to ensure react can identify the products with a key that is automatically given and incremented by .map method
                  <tr key={key}> 
                    <th scope="row">{ product.id.toString() }</th>
                    <td>{ product.name }</td>
                    <td>{ product.price.toString()} DAPP</td>
                    <td>{ product.owner }</td>
                    <td>
                    { product.owner!==this.props.account
                        ? <button
                            id={product.id}
                            className="btn btn-primary " 
                            onClick={(event) => {
                              this.props.purchaseProduct(event.target.id)
                            }}
                        >
                          Buy
                        </button>
                        :   null
                    }
                    </td>
                    <td>
                    { this.props.bought === true 
                        ? <button
                        id={product.id}
                        className="btn btn-primary " 
                        role="button" 
                        aria-pressed="true"
                        onClick={(event) => {
                          this.props.downloadMusic(event.target.id)
                        }}
                        >
                            Download File
                        </button>
                        : null
                    }
                    </td>
                    <td>
                    { true 
                        ? <button
                        id={product.id}
                        className="btn btn-primary " 
                        role="button" 
                        aria-pressed="true"
                        onClick={(event) => {
                          this.props.streamMusic(event.target.id)
                        }}
                        >
                            Stream
                        </button>
                        : null
                    }
                    </td>
                    <td>
                    { product.owner!==this.props.account 
                        ? <button
                        id={product.id}
                        // price= '1000000000000000000'
                        className="btn btn-primary " 
                        role="button" 
                        aria-pressed="true"
                        onClick={(event) => {
                           this.props.tipProduct(event.target.id, 2)
                        }}
                        >
                            Tip 2 DAPP
                        </button>
                        : null
                    }
                    </td>
                </tr>
                )
            })
          }
           
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;
