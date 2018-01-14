import { sankeyLinkHorizontal} from 'd3-sankey';
import {select} from 'd3-selection';
import {scaleOrdinal, schemeCategory10} from 'd3-scale';
import { format } from 'd3-format';
import React, {Component} from 'react';
// import * as util from './util';

class DemoChart extends Component {

  constructor() {
    super();
    this.formatNumber = format(",.0f")
    this.formatNum = function(d) { return this.formatNumber(d) + " TWh"; }
    this.color = scaleOrdinal(schemeCategory10);
  }

  nodeEnter = (node) => {
    node.append("rect")
        .attr("x", function(d) { return d.x0; })
        .attr("y", function(d) { return d.y0; })
        .attr("height", function(d) { return d.y1 - d.y0; })
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("fill", (d) => { return this.color(d.name.replace(/ .*/, "")); })
        .attr("stroke", "#000");
  
    node.append("text")
        .attr("x", function(d) { return d.x0 - 6; })
        .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .text(function(d) { return d.name; })
      .filter((d) => { return d.x0 < 900 / 2; })
        .attr("x", function(d) { return d.x1 + 6; })
        .attr("text-anchor", "start");
  
    node.append("title")
        .text(function(d) { return d.name + "\n" + format(d.value); });
  }

  nodeUpdate = (node) => {
    console.log(node);
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

  linkEnter = (link) => {
    console.log("link enter")
    link
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke-width', (d) => (Math.max(1, d.width)));
    link.append("title")
      .text((d) => (`${d.source.name} → ${d.target.name}\n${this.formatNum(d.value)}`));
  }

  linkUpdate = (link) => {
    link
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke-width', (d) => (Math.max(1, d.width)));
  }

  graphUpdate = (selection) => {
    selection.selectAll('.node')
      .call(this.nodeUpdate);
    selection.selectAll('.link')
      .call(this.linkUpdate);
  }

  componentDidMount() {
    this.svg = select("svg");
    const svg = this.svg;
    
    this.link = svg.append("g")
        .attr("class", "links")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.2)
      .selectAll("path");

    this.link = this.link.data(this.props.links);
    this.link.enter().append("path").call(this.linkEnter);

    this.node = svg.append("g")
        .attr("class", "nodes")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
      .selectAll("g");

    this.node = this.node.data(this.props.nodes);
    this.node.enter().append("g").call(this.nodeEnter);
  }
  
  shouldComponentUpdate(nextProps) {
    this.link = this.link.data(nextProps.links, (node) => (node.name));
    this.link.enter()//.append('path').call(this.linkEnter);
    this.link.exit().remove();
    this.link.call(this.linkUpdate);
      
    this.node = this.node.data(nextProps.nodes, (node) => (node.name));
    this.node.enter()//.append("g").call(this.nodeEnter);
    this.node.exit().remove();
    this.node.call(this.nodeUpdate);
  }
  
  render() {
    return (
      <div>
        <svg width={900} height={500}>
        </svg>
      </div>
    )
  }
}

export default DemoChart;
