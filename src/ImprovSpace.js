import React, { useState } from "react";
import Konva from "konva";
import { Stage, Layer, Path, Group, Line, Rect } from "react-konva";
import { splitShape, boundaryToSVG, closestEdgeToPoint } from "./helpers";
import ImprovTransformer from "./ImprovTransformer";
import { useStore } from "./store";

export const ImprovSpace = () => {
  const { state, dispatch } = useStore();
  const stageEl = React.createRef();
  const layerEl = React.createRef();

  function handleStageMouseDown() {
    return null;
  }

  function drawingSeam() {
    return null;
  }

  function handleStageMouseUp() {
    return null;
  }
  return (
    <Stage
      className="improvStage"
      width={1000}
      height={800}
      onMouseDown={e => handleStageMouseDown(e)}
      onMouseMove={e => drawingSeam(e)}
      onMouseUp={e => handleStageMouseUp(e)}
      ref={stageEl}
    >
      <Layer ref={layerEl} />
    </Stage>
  );
};
