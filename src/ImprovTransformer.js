import React, { Component, useState, useEffect } from "react";

import {
  Stage,
  Layer,
  Path,
  Transformer,
  Group,
  Line,
  Rect
} from "react-konva";

export default class ImprovTransformer extends React.Component {
  componentDidMount() {
    this.checkNode();
  }
  componentDidUpdate() {
    this.checkNode();
  }

  onTransformStart() {
    console.log("onTransformStart");
  }

  onTransform() {
    console.log("onTransform");
  }

  shapeSnap(activeObject) {
    var edgedetection = 40; //pixels to snap
    console.log("in shape snap");
    // const stage = this.transformer.getStage();
    // var shapes = stage.find(".improvGroup");
    // var selected = shapes.filter(shape => shape.isVisible());
    // shapes = selected;
    // console.log(activeObject)
    // // console.log(activeObject.getType())
    // // console.log(activeObject.getAbsoluteTransform().decompose())
    // var activeObjBB = getBBfromClientRect(activeObject);
    //
    // for (var i = 0; i < shapes.length; i++) {
    //   var targ = shapes[i];
    //   console.log(targ, activeObject);
    //   console.log(activeObjBB);
    //
    //   if (targ.id() == activeObject.id()) {
    //     return;
    //   }
    //   var targBB = getBBfromClientRect(targ);
    //   console.log(targBB)
    //
    //   //snap from right
    //   if (Math.abs(activeObjBB.tr.x - targBB.tl.x) < edgedetection) {
    //     console.log("case1")
    //     activeObject.x(targBB.left - activeObject.getClientRect().width);
    //     activeObjBB = getBBfromClientRect(activeObject);
    //   }
    //   // snap from left
    //   if (Math.abs(activeObjBB.tl.x - targBB.tr.x) < edgedetection) {
    //     console.log("case2")
    //     activeObject.x(targBB.left + targ.getClientRect().width);
    //     activeObjBB = getBBfromClientRect(activeObject);
    //   }
    //   // snap from top
    //   if (Math.abs(activeObjBB.br.y - targBB.tr.y) < edgedetection) {
    //     console.log("case3")
    //     activeObject.y(targBB.top - activeObject.getClientRect().height);
    //     activeObjBB = getBBfromClientRect(activeObject);
    //   }
    //   // snap from bottom
    //   if (Math.abs(targBB.br.y - activeObjBB.tr.y) < edgedetection) {
    //     console.log("case4")
    //     activeObject.y(targBB.top + targ.getClientRect().height);
    //     activeObjBB = getBBfromClientRect(activeObject);
    //   }
    //   this.transformer.getLayer().batchDraw();
    //   const overlapping = Konva.Util.haveIntersection(
    //     targ.getClientRect(),
    //     activeObject.getClientRect()
    //   );
    //   console.log(targ.getClientRect(), activeObject.getClientRect())
    //   if (overlapping) {
    //     console.log("overlapping")
    //     targ.alpha(0.1)
    //     activeObject.alpha(0.1);
    //   } else {
    //     targ.alpha(0.9)
    //     activeObject.alpha(0.9);
    //   }
    // }
  }

  checkNode() {
    // here we need to manually attach or detach Transformer node
    const stage = this.transformer.getStage();
    const { selectedShapeName, selectedMode } = this.props;

    if (selectedMode === "design") {
      var selectedNode = stage.findOne("#" + selectedShapeName);
      console.log(selectedNode);
      // do nothing if selected node is already attached
      if (selectedNode === this.transformer.node()) {
        return;
      }
      if (selectedNode && !selectedNode.isVisible()) {
        console.log("detaching");
        this.transformer.detach();
      } else if (selectedNode && selectedShapeName.length > 0) {
        const type = selectedNode.getType();
        console.log(type);
        if (type == "Group") {
          this.shapeSnap(selectedNode);
          selectedNode = selectedNode.children;
          console.log(selectedNode);
          this.transformer.nodes(selectedNode);
        }
      } else {
        // remove transformer
        this.transformer.detach();
      }
      // var boundaryRectangle = stage.findOne(".boundaryRectangle");
      // var shapes = stageEl.current.find(".improvShape");
      // var selectedShapes = shapes.filter(shape => shape.isVisible());
      // var maxX = 0;
      // var maxY = 0;
      // selectedShapes.forEach((element) => {
      //   var x = element.x() + element.width();
      //   var y = element.y() + element.height();
      //   if (x > maxX) {
      //     maxX = x;
      //   }
      //   if (y > maxY) {
      //     maxY = y;
      //   }
      // })
      // boundaryRect.width(maxX)
      // boundaryRect.height(maxY)
      // this.transformer.getLayer().batchDraw();
      // var json = stage.toJSON();
      // console.log(JSON.parse(json));
    }

    // else if (selectedMode === 'seam') {
    //   var selectionRectangle = stage.findOne(".selectionRectangle");
    //   if (!selectionRectangle.visible()) {
    //       return;
    //     }
    //     // update visibility in timeout, so we can check it in click event
    //     setTimeout(() => {
    //       selectionRectangle.visible(false);
    //       this.transformer.getLayer().batchDraw();
    //     });
    //
    //     var shapes = stage.find('.path').toArray();
    //     var box = selectionRectangle.getClientRect();
    //     var selected = shapes.filter((shape) =>
    //       Konva.Util.haveIntersection(box, shape.getClientRect())
    //     );
    //     this.transformer.nodes(selected);
    //     this.transformer.getLayer().batchDraw();
    // }
  }
  render() {
    return (
      <Transformer
        ref={node => {
          this.transformer = node;
        }}
        keepRatio={true}
        transformstart={this.onTransformStart}
        transform={this.onTransform}
        transformend={this.onTransformEnd}
      />
    );
  }
}
