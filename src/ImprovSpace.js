import React, { useState } from "react";
import Konva from "konva";
import { Stage, Layer, Path, Group, Line, Rect, Circle } from "react-konva";
import { splitShape, boundaryToSVG, closestEdgeToPoint } from "./helpers";
import ImprovTransformer from "./ImprovTransformer";
import { useStore } from "./store";
import { Box } from "@material-ui/core";

export const ImprovSpace = () => {
  const { state, dispatch } = useStore();
  const stageEl = React.createRef();
  const layerEl = React.createRef();
  const selectionRectRef = React.createRef();
  const tr = React.createRef();

  function handleStageMouseDown(e) {
    e.preventDefault;
    if (state.tool == "selecttool") {
      mouseDownSelect(e);
    }
  }

  function handleStageMouseMove(e) {
    if (state.tool == "selecttool") {
      mouseMoveSelect(e);
    }
  }

  function handleStageMouseUp(e) {
    if (state.tool == "selecttool") {
      mouseUpSelect(e);
      console.log(state);
    }
  }

  function handleDoubleClick(event) {
    console.log("dc");
    if (event.target !== event.target.getStage()) {
      console.log("ss", state.selectedShapes);
      var idx = event.target.id();
      var index = state.selectedShapes.indexOf(idx);
      var whichPieceGroup = idx.split("-")[1];
      if (index < 0) {
        var newSelectedShapes = [...state.selectedShapes, whichPieceGroup];
        dispatch({
          type: "selectShapes",
          message: "selectShapes",
          selectedShapes: newSelectedShapes
        });
      }
    } else {
      dispatch({
        type: "selectShapes",
        message: "selectShapes",
        selectedShapes: []
      });
    }
  }
  function removeShape(idx) {
    var whichPieceGroup = idx.split("-")[1];
    var array = [...state.selectedShapes]; // make a separate copy of the array
    var index = array.indexOf(whichPieceGroup);
    if (index !== -1) {
      array.splice(index, 1);
    }
    return array;
  }

  function handleClick(event) {
    if (event.target !== event.target.getStage()) {
      var newSelectedShapes = removeShape(event.target.id());
      dispatch({
        type: "selectShapes",
        message: "selectShapes",
        selectedShapes: newSelectedShapes
      });
    } else {
      dispatch({
        type: "selectShapes",
        message: "selectShapes",
        selectedShapes: []
      });
    }
  }

  function getDistanceBetweenPieces(p1, p2) {
    if (Konva.Util.haveIntersection(p1.getClientRect(), p2.getClientRect())) {
      return 0;
    }
    var cr1 = p1.getClientRect();
    var pos1 = p1.absolutePosition();
    var c1x = pos1.x + cr1.width / 2;
    var c1y = pos1.y + cr1.height / 2;

    var cr2 = p2.getClientRect();
    var pos2 = p2.absolutePosition();
    var c2x = pos2.x + cr2.width / 2;
    var c2y = pos2.y + cr2.height / 2;
    var dx = Math.abs(c1x - c2x);
    var dy = Math.abs(c1y - c2y);
    var avgWidth = (cr1.width + cr2.width) / 2.0;
    var avgHeight = (cr1.height + cr2.height) / 2.0;
    var dist = Math.max(dx - avgWidth, dy - avgHeight);
    return dist;
  }

  function checkSew() {
    var shapeEls = [];
    var seamDistances = [];
    var seamsClose = true;
    for (var i = 0; i < state.selectedShapes.length; i++) {
      var shapeId1 = state.selectedShapes[i];
      var n1 = stageEl.current.findOne("#" + shapeId1);
      for (var j = 0; j < state.selectedShapes.length; j++) {
        var shapeId2 = state.selectedShapes[j];
        var n2 = stageEl.current.findOne("#" + shapeId2);
        console.log("here", shapeId1, n1, shapeId2, n2);
        if (n1 && n2 && n1 != n2) {
          var dist = getDistanceBetweenPieces(n1, n2);
          console.log("dist", dist);
          if (dist > 10) {
            seamsClose = false;
          }
        }
      }
    }
    return seamsClose;
  }

  function handleSew() {
    if (state.tool == "sewtool") {
      var piecesToSew = [];
      var checkDist = checkSew();
      console.log(checkDist);
      if (checkDist) {
        state.selectedShapes.map((shapeId, i) => {
          var whichPieceGroup = shapeId.split("-")[1];
          if (piecesToSew.indexOf(whichPieceGroup) < 0) {
            piecesToSew.push(whichPieceGroup);
          }
        });
        dispatch({
          type: "sewPieces",
          message: "sewPieces",
          piecesToSew: piecesToSew
        });
        dispatch({
          type: "selectTool",
          message: "selectTool",
          tool: "selecttool"
        });
        console.log("state after sew", state);
      } else {
        dispatch({
          type: "displayError",
          message: "displayError",
          errorMessage: "pieces too far to sew"
        });
      }
    }
  }

  function handleMouseMove() {
    handleSew();
  }
  return (
    <div className="improvStage">
      <Stage
        key="improvStage"
        width={1000}
        height={800}
        onDblClick={handleDoubleClick}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        ref={stageEl}
      >
        <Layer ref={layerEl}>
          {Object.keys(state.pieceGroups).map((keyName, i) => {
            return (
              <Group
                name={"improvGroup"}
                id={keyName}
                draggable
                onDrag={(e) => draggingGroup(e)}
              >
                {Object.keys(state.pieceGroups[keyName].pieceData).map(
                  (pieceName, j) => (
                    <Path
                      name={"improvShape"}
                      id={"piece-" + keyName + "-" + pieceName}
                      key={"piece-" + keyName + "-" + pieceName}
                      x={state.pieceGroups[keyName].pieceData[pieceName].x}
                      y={state.pieceGroups[keyName].pieceData[pieceName].y}
                      data={state.pieceGroups[keyName].pieceData[pieceName].svg}
                      fill={
                        state.pieceGroups[keyName].pieceData[pieceName].color
                      }
                      opacity={0.9}
                      visible={
                        state.pieceGroups[keyName].onDesignWall ? true : false
                      }
                      stroke={
                        state.selectedShapes.includes(keyName)
                          ? "black"
                          : "white"
                      }
                    />
                  )
                )}
              </Group>
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
};
