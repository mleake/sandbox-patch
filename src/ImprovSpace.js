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
      if (index < 0) {
        var newSelectedShapes = [...state.selectedShapes, idx];
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
    var array = [...state.selectedShapes]; // make a separate copy of the array
    var index = array.indexOf(idx);
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

  function handleDoubleTap() {
    console.log("dt");
  }

  return (
    <div className="improvStage">
      <Stage
        key="improvStage"
        width={1000}
        height={800}
        onDblClick={handleDoubleClick}
        onClick={handleClick}
        ref={stageEl}
      >
        <Layer ref={layerEl}>
          {Object.keys(state.pieceGroups).map((keyName, i) => {
            return (
              <Group
                name={"improvGroup"}
                id={"key-" + keyName}
                key={"group-" + keyName}
              >
                {Object.keys(state.pieceGroups[keyName].pieceData).map(
                  (pieceName, j) => (
                    <Rect
                      id={"piece-" + keyName + "-" + pieceName}
                      key={"piece-" + keyName + "-" + pieceName}
                      className={"piece"}
                      width={28}
                      height={28}
                      x={0}
                      y={0}
                      fill={
                        state.pieceGroups[keyName].pieceData[pieceName].color
                      }
                      visible={
                        state.pieceGroups[keyName].onDesignWall ? true : false
                      }
                      stroke={
                        state.selectedShapes.includes(
                          "piece-" + keyName + "-" + pieceName
                        )
                          ? "black"
                          : "white"
                      }
                      draggable
                    />
                  )
                )}
              </Group>
            );
          })}
          {/* <Circle
            key={"piece-" + 0 + "-" + 0}
            id={"c1"}
            x={50}
            y={50}
            fill={"red"}
            width={40}
            height={40}
            stroke={state.selectedShapes.includes("c1") ? "black" : "white"}
          />
          <Circle
            id={"c2"}
            x={40}
            y={40}
            fill={"pink"}
            width={30}
            height={30}
            stroke={state.selectedShapes.includes("c2") ? "black" : "white"}
          /> */}
        </Layer>
      </Stage>
    </div>
  );
};
