import React, { Component } from "react";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";
import { select } from "d3-selection";
// import DagreGraph from "dagre-d3-react";

import DagreD3Component from "./DagreD3.js";
// import DagreD3 from "react-dagre-d3";
import DagreGraph from "dagre-d3-react";
import { useStore } from "./store";

var gl = require("@dagrejs/graphlib");
var dagre = require("dagre");

export default class D3Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = { graph: null, nodes: [], edges: [], ready: false };
  }

  createGraph() {
    // const g = new dagre.graphlib.Graph();
    // g.setNode("t1", { label: "t1: Kevin Spacey", width: 140, height: 100 });
    // g.setNode("t2", { label: "t2: Saul Williams", width: 140, height: 100 });
    // g.setNode("t3", { label: "t3: Brad Pitt", width: 140, height: 100 });
    // g.setNode("t4", { label: "t4: Harrison Ford", width: 140, height: 100 });
    // g.setNode("t5", { label: "t5: Luke Wilson", width: 140, height: 100 });
    // g.setNode("t6", { label: "t6: Kevin Bacon", width: 140, height: 100 });
    // g.setEdge("t2", "t1");
    // g.setEdge("t5", "t4");
    // g.setEdge("t6", "t4");
    // g.setEdge("t6", "t3");
    var nobj1 = {};
    for (var i = 0; i < 7; i++) {
      console.log(i);
      nobj1[i.toString()] = { label: "t" + i.toString() };
    }
    console.log("here1", nobj1);
    // this.state.graph = g;
    // var nodes = {
    //   "1": {
    //     label: "Node 1"
    //   },
    //   "2": {
    //     label: "Node 2"
    //   },
    //   "3": {
    //     label: "Node 3"
    //   },
    //   "4": {
    //     label: "Node 4"
    //   }
    // };
    // var edges = [
    //   ["1", "2", {}],
    //   ["1", "3", {}],
    //   ["2", "4", {}],
    //   ["3", "4", {}]
    // ];
    var el = [];
    // g.edges().forEach((edge, i) => {
    //   el.push([edge.v, edge.w, {}]);
    // });
    nobj1 = { t1: { label: "t1" }, t2: { label: "t2" } };
    el = [["t1", "t2", {}]];
    console.log("here", nobj1, el);
    this.setState({ nodes: nobj1, edges: el, ready: true });
    console.log(this.state);
  }

  render() {
    if (this.state.ready) {
      return (
        <>
          <button onClick={this.createGraph.bind(this)}>graph</button>
          <DagreD3Component nodes={this.state.nodes} edges={this.state.edges} />
        </>
      );
    } else {
      return <button onClick={this.createGraph.bind(this)}>graph</button>;
    }
  }
}
