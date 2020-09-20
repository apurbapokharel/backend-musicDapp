import React, { Component, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { assignIdentifier } from '../action/index';

function Main(props) {
  const [productName, setProductName] = useState('');
  const [productAname, setProductAname] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productIdentifier, setProductIdentifier] = useState('');
  const dispatch = useDispatch()
  // const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');
    return (
      <div id="content">
        <h1>Add Product</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = productName
          const aname = productAname
          const price = productPrice
          const musicIdentifier = productIdentifier
          const aesKey = props.aesKey
          if(props.musicHash !== ''){
            props.createProduct(name, aname, price, musicIdentifier, aesKey) //we are calling the function in App.js which calls the fucntion in the SC
          } else {
            window.alert('Please upload file to IPFS first')
          }
          
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="productName"
              type="text"
              value={productName}
              onChange={(e) => { setProductName(e.target.value)}} //react manages the value of form elements using ref
              className="form-control"
              placeholder="Music Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productAname"
              type="text"
              value={productAname}
              onChange={(e) => { setProductAname(e.target.value)}}
              className="form-control"
              placeholder="Artist's Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productPrice"
              type="text"
              value={productPrice}
              onChange={(e) => { setProductPrice(e.target.value)}}
              className="form-control"
              placeholder="Product Price in DAPP"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productIdentifier"
              type="text"
              value={productIdentifier}
              onChange={(e) => { setProductIdentifier(e.target.value)}}
              className="form-control"
              placeholder="Music Identifier name used to fetch it from IPFS"
              required />
          </div>
          <div className="form-group mr-sm-2 ">
            <input
              type="file"
              className="form-control "
              placeholder="Select product"
              onChange={ props.captureFile }
              required />
            <input 
              type="button"
              className="form-control"
              value="Upload file to IPFS"
              placeholder="memeHash" 
              onClick={() => {
                dispatch(assignIdentifier(productIdentifier))
                props.onSubmitt()
              }}
              // onClick={ props.onSubmitt}
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
              <th scope="col">Artist</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col"></th> 
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            { props.products.map((product,key) => { 
                return(
                  // we assign a key to each row elements..this is required by react so as to ensure react can identify the products with a key that is automatically given and incremented by .map method
                  <tr key={key}> 
                    <th scope="row">{ product.id.toString() }</th>
                    <td>{ product.musicName }</td>
                    <td>{ product.artistName }</td>
                    <td>{ product.price.toString()} DAPP</td>
                    <td>{ product.owner }</td>
                    <td>
                    { product.owner!==props.account
                        ? <button
                            id={product.id}
                            className="btn btn-primary " 
                            onClick={(event) => {
                              props.purchaseProduct(event.target.id)
                            }}
                        >
                          Buy
                        </button>
                        :   null
                    }
                    </td>
                    <td>
                    { props.bought === true 
                        ? <button
                        id={product.id}
                        className="btn btn-primary " 
                        role="button" 
                        aria-pressed="true"
                        onClick={(event) => {
                          props.downloadMusic(event.target.id)
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
                          props.streamMusic(event.target.id)
                        }}
                        >
                            Stream
                        </button>
                        : null
                    }
                    </td>
                    <td>
                    { product.owner!==props.account 
                        ? <button
                        id={product.id}
                        // price= '1000000000000000000'
                        className="btn btn-primary " 
                        role="button" 
                        aria-pressed="true"
                        onClick={(event) => {
                          props.tipProduct(event.target.id, 2)
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

export default Main;
