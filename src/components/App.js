import React, { Component } from 'react';
import Navbar from './Navbar';
import Home from './Home';
import BuyToken from './BuyToken'
import ViewStats from './ViewStats'
import TrackToken from './trackTokens'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';

class App extends Component {


  render() {
    return (
      <Router>
        <div className="App">
          <Navbar/>
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/buytoken" component={BuyToken}/>
            <Route path="/tracktokens" component={TrackToken} />
            <Route path="/viewstats" component={ViewStats}/>
          </Switch>  
        </div>
      </Router>

      

    );
  }
}

export default App;


