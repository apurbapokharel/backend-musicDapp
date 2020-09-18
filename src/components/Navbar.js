import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class Navbar extends Component {

  render() {
    return (

     <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <Link to='/'>
            <li className="nav-item active">
              <h6 className="nav-link">Home</h6> 
            </li>
          </Link>  
          <Link to='/buytoken'>
            <li className="nav-item active">
              <h6 className="nav-link">Buy Tokens</h6> 
            </li>
          </Link> 
          <Link to='/tracktokens'>
            <li className="nav-item active">
              <h6 className="nav-link">Track Tokens</h6> 
            </li>
          </Link>
          <Link to='/viewstats'>
            <li className="nav-item active">
              <h6 className="nav-link">View Stats</h6> 
            </li>
          </Link> 
        </ul>
      </div>
    </nav>
    );
  }
}

export default Navbar;
