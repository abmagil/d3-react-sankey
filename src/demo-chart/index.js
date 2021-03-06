import { sankeyLinkHorizontal} from 'd3-sankey';
import {select, selectAll} from 'd3-selection';
import {scaleOrdinal, schemeCategory10} from 'd3-scale';
import { format } from 'd3-format';
import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
// import * as util from './util';

class DemoChart extends Component {

  constructor() {
    super();
    this.formatNumber = format(",.0f")
    this.formatNum = function(d) { return `$${this.formatNumber(d)}`; }
    this.color = scaleOrdinal(schemeCategory10);
  }

  nodeEnter = (node) => {
    node.append("rect");
    node.append("text");
    node.append("title");
  }

  nodeUpdate = (node) => {
    node.select("rect")
      .attr("x", function(d) { return d.x0; })
      .attr("y", function(d) { return d.y0; })
      .attr("height", function(d) { return d.y1 - d.y0; })
      .attr("width", function(d) { return d.x1 - d.x0; })
      .attr("fill", (d) => { return this.color(d.name.replace(/ .*/, "")); })
      .attr("stroke", "#000");
      
    node.select("text")
      .attr("x", function(d) { return d.x0 - 6; })
      .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .text(function(d) { return d.name; })
      .filter((d) => { return d.x0 < 900 / 2; })
      .attr("x", function(d) { return d.x1 + 6; })
      .attr("text-anchor", "start");
      
    node.select("title")
      .text(function(d) { return d.name + "\n" + format(d.value); });
  }

  nodeSort = (a, b) => {
    return a.name > b.name;
  }

  linkEnter = (link) => {
    link.append("title")
      .text((d) => (`${d.source.name} → ${d.target.name}\n${this.formatNum(d.value)}`));
  }

  linkUpdate = (link) => {
    link
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke-width', (d) => (Math.max(1, d.width)));
  }

  linkKeyFn = (link) => {
    return `${link.source.name}->${link.target.name}`;
  }

  linkSort = (a, b) => {
    return a.source.name > b.source.name;
  }

  componentDidMount() {
    this.svg = select(findDOMNode(this));
    const svg = this.svg;
    
    this.link = svg.append("g")
        .attr("class", "links")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.2)
      .selectAll("path")
        .data(this.props.links, this.linkKeyFn);

    this.link.enter()
      .append("path")
        .call(this.linkEnter)
      .merge(this.link)
        .call(this.linkUpdate);

    this.node = svg.append("g")
        .attr("class", "nodes")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
      .selectAll("g")
        .data(this.props.nodes, (node) => (node.name));

    this.node.enter().append("g")
      .call(this.nodeEnter)
    .merge(this.node)
        .call(this.nodeUpdate);
  }
  
  componentDidUpdate(_prevProps, _prevState) {
    this.link = select("g.links").selectAll("path").data(this.props.links, this.linkKeyFn);
    this.link.exit().remove();
    this.link.enter()
      .append('path').call(this.linkEnter)
    .merge(this.link)
      .call(this.linkUpdate);

    this.node = select("g.nodes").selectAll("g").data(this.props.nodes, (node) => (node.name));
    this.node.exit().remove();
    this.node.enter()
      .append("g").call(this.nodeEnter)
    .merge(this.node)
      .call(this.nodeUpdate);
  }
  
  render() {
    return (
      <svg width={900} height={500}>
      </svg>
    )
  }
}

export default DemoChart;
