import {sankey} from 'd3-sankey';
import React, {Component} from 'react';
import {cloneDeep} from 'lodash';

class SankeyDriver extends Component {
  constructor(props) {
    super(props);
    this.width = props.width;
    this.height = props.height;
    this.sankeyGraph = sankey()
      .nodeWidth(15)
      .nodeId((d) => (d.name))
      .nodePadding(10)
      .extent([[1, 1], [this.width - 1, this.height - 6]]);
  }

  render() {
    const {nodes, links} = this.sankeyGraph({
      nodes: cloneDeep(this.props.nodes),
      links: cloneDeep(this.props.links)
    });
    
    return (
    <div>
      {this.props.children(nodes, links)}
    </div>
    )
  }   
}

export default SankeyDriver;
