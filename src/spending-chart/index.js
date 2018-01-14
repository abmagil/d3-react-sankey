/* eslint-disable */
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { select } from 'd3-selection';
import { format } from 'd3-format';
import { scaleOrdinal, schemeCategory10 } from 'd3-scale';
import {sankey, sankeyLinkHorizontal} from 'd3-sankey';
import { flatMap } from 'lodash'
import * as util from './util';

const color = scaleOrdinal(schemeCategory10);

const enterNodes = (selection) => {
  selection.classed(".nodes", true);

}

const sankeyGraph = sankey()
    .nodeWidth(15)
    .nodePadding(10)
    .nodeId((node) => { return node.name })
    .extent([[1, 1], [480 - 1, 480 - 6]]);

const link = (svg) => {
  svg.append("g")
    .attr("class", "links")
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("stroke-opacity", 0.2)
    .selectAll("path");
}

const updateNode = (svg) => {
  svg.append("g")
    .attr("class", "nodes")
  .selectAll("g");
}

const enterLink = (selection) => {
  selection.append("path")
    .attr("d", sankeyLinkHorizontal())
    .attr("stroke-width", function(d) { return Math.max(1, d.width); });
};

const updateLink = (link) => {
  link.append("title")
  .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });
};

const updateGraph = (selection) => {
  selection.selectAll('.nodes').call(updateNode);
  selection.selectAll('.path').call(updateLink);
}

// layout lives outside class

class SpendingChart extends Component {
  constructor() {
    super();
    this.height=480;
    this.width=480;
  }
  
  calculateNodesAndLinks = ({data}) => {
    const sankeyData = {
      nodes: [],
      links: [],
    };

    // TODO: Rewrite to be recursive 
    sankeyData.nodes = flatMap(
      Object.entries(data), // ["entertainment", {movies: 10, games: 20}]
      ([category, subcategories]) => {
        return [
          {name: category},
          ...Object.entries(subcategories).map(([subcategory, _expense]) => {
            return { name: subcategory}
          })
        ]
      }
    );
    sankeyData.nodes.push({name: "total"})

    const accumulatedLinks = [];
    Object.entries(data).forEach(([category, subcategories]) => {
      let newLink = {
        source: category,
        target: "total",
        value: 0
      };
      Object.entries(subcategories).forEach(([subcategory, value]) => {
        newLink.value = newLink.value + value;
        accumulatedLinks.push({
          source: subcategory,
          target: category,
          value
        });
      });
      accumulatedLinks.push(newLink);
    });
    sankeyData.links = accumulatedLinks;

    return sankeyData;
  }

  componentDidMount() {
    this.d3Graph = select(findDOMNode(this.refs.svg));
    sankeyGraph(util.calculateData(this.props));
  }

  shouldComponentUpdate(nextProps) {
    this.d3Graph = select(this.svg);

    const d3Nodes = this.d3Graph.selectAll('.nodes')
      .data(util.calculateData(this.props).nodes);
    d3Nodes.enter().append("g").call(enterNodes);
    d3Nodes.exit().remove();
    d3Nodes.call(updateNode);

    const d3Links = this.d3Graph.selectAll('.link')
      .data(util.calculateData(nextProps).links);
    d3Links.enter().call(enterLink);
    d3Links.exit().remove();
    d3Links.call(updateLink);

    // return false;
    return true;
  }
  
  render() {
    return (
      <svg height={this.height} width={this.width} ref={(ref) => this.svg = ref}>
      </svg>
    )
  }
}

export default SpendingChart;
/* eslint-enable */
