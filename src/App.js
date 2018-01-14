import {uniqBy, partialRight} from 'lodash';
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SpendingForm from './spending-form';
import DemoChart from './demo-chart';
import SankeyDriver from './demo-chart/sankey-driver';
import defaultCategories from './spending-form/default-categories';
import * as util from './demo-chart/util';


const uniqByName = partialRight(uniqBy, 'name')

class App extends Component {  
  constructor() {
    super();
    this.state = {
      ...defaultCategories(),
    }
  }

  updateData = ({e, category, subcategory}) => {
    const newVal = parseInt(e.target.value, 10);
    
    this.setState(prevState => {
      return {
      ...prevState,
      [category]: {
        ...prevState[category],
        [subcategory]: newVal
      }
    };
  });
  }
  
  render() {
    const {nodes: entNodes, links: entLinks} = util.calculateData({entertainment: this.state.entertainment});
    const {nodes: investingNodes, links: investingLinks} = util.calculateData({investing: this.state.investing});
    const totalData = {
      nodes: uniqByName([...entNodes, ...investingNodes]),
      links: [...entLinks, ...investingLinks],
    };
    
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <SpendingForm data={{entertainment: this.state.entertainment, investing: this.state.investing}} updateFn={this.updateData} />
          {/* <SpendingChart data={this.state}/> */}
          <SankeyDriver {...totalData} width={900} height={500}>
            {(nodes, links) => (
              <div>
                <DemoChart nodes={nodes} links={links} />
              </div>
            )}
          </SankeyDriver>
      </div>
    );
  }
}

export default App;
