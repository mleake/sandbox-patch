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
  const [selectionRect, setSelectionRect] = useState({});
  const [startedSelection, setStartedSelection] = useState(false);
  const [draggedSelection, setDraggedSelection] = useState(false);
  const [selectedShapes, setSelectedShapes] = useState([]);

  function mouseDownSelect(event) {
    //ignore clicks on shapes
    if (event.target !== event.target.getStage()) {
      return;
    }
    const pos = stageEl.current.getPointerPosition();
    setSelectionRect({ startX: pos.x, startY: pos.y, width: 0, height: 0 });
    setStartedSelection(true);
    setDraggedSelection(false);
    setSelectedShapes([]);
  }

  function mouseMoveSelect(event) {
    if (startedSelection) {
      const sx = selectionRect.startX;
      const sy = selectionRect.startY;
      const pos = stageEl.current.getPointerPosition();
      const annotationToAdd = {
        startX: sx,
        startY: sy,
        width: pos.x - sx,
        height: pos.y - sy
      };
      setSelectionRect(annotationToAdd);
      setDraggedSelection(true);
    }
  }

  function mouseUpSelect(event) {
    if (startedSelection && draggedSelection) {
      var sx = selectionRect.startX;
      var sy = selectionRect.startY;
      var pos = stageEl.current.getPointerPosition();
      const annotationToAdd = {
        startX: sx,
        startY: sy,
        width: pos.x - sx,
        height: pos.y - sy
      };
      setSelectionRect(annotationToAdd);

      var shapes = stageEl.current.find("Circle").toArray();
      if (shapes.length > 0) {
        var sr = stageEl.current.findOne("#sr");
        var box = sr.getClientRect();
        var selected = shapes.filter(
          (shape) =>
            shape.isVisible() &&
            Konva.Util.haveIntersection(box, shape.getClientRect())
        );
        var selectedIds = [];
        selected.forEach((shape) => selectedIds.push(shape.id()));
        setSelectedShapes(selectedIds);
      }
    } else {
      setSelectedShapes([]);
    }
    setStartedSelection(false);
    setSelectionRect({});
  }

  function handleStageMouseDown(e) {
    e.preventDefault;
    console.log(stageEl.current.getPointerPosition());
    if (state.tool === "selecttool") {
      mouseDownSelect(e);
    }
  }

  function handleStageMouseMove(e) {
    if (state.tool === "selecttool") {
      mouseMoveSelect(e);
    }
  }

  function handleStageMouseUp(e) {
    if (state.tool === "selecttool") {
      mouseUpSelect(e);
    }
  }

  return (
    <div className="improvStage">
      <Stage
        key="improvStage"
        width={1000}
        height={800}
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        ref={stageEl}
      >
        <Layer ref={layerEl}>
          <Rect
            x={selectionRect.startX}
            y={selectionRect.startY}
            width={selectionRect.width}
            height={selectionRect.height}
            fill="transparent"
            stroke="blue"
            ref={selectionRectRef}
            id={"sr"}
          />
          {Object.keys(state.pieceGroups).map((keyName, i) => {
            return (
              <Group
                name={"improvGroup"}
                id={keyName}
                key={"group-" + keyName}
                draggable
                onDrag={(e) => draggingGroup(e)}
              >
                {Object.keys(state.pieceGroups[keyName].pieceData).map(
                  (pieceName, j) => (
                    <Rect
                      key={"piece-" + keyName + "-" + pieceName}
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
                    />
                  )
                )}
              </Group>
            );
          })}
          <Circle
            id={"c1"}
            x={50}
            y={50}
            fill={"red"}
            width={40}
            height={40}
            stroke={selectedShapes.includes("c1") ? "black" : "white"}
            draggable
          />
          <Circle
            id={"c2"}
            x={40}
            y={40}
            fill={"pink"}
            width={30}
            height={30}
            stroke={selectedShapes.includes("c2") ? "black" : "white"}
            draggable
          />
        </Layer>
      </Stage>
    </div>
  );
};
