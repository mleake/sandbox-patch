import React, { useState } from "react";
import Konva from "konva";
import { Stage, Layer, Path, Group, Line, Rect, Circle } from "react-konva";
import { splitShape, boundaryToSVG, closestEdgeToPoint } from "./helpers";
import { toPoints } from "svg-points";
import ImprovTransformer from "./ImprovTransformer";
import { useStore } from "./store";
import { Box } from "@material-ui/core";
import CropIcon from "@material-ui/icons/Crop";
import PaletteIcon from "@material-ui/icons/Palette";
import { GiResize, GiArrowCursor, GiSewingNeedle } from "react-icons/gi";
import { GrUndo, GrRedo } from "react-icons/gr";
// import { AiOutlineRotateLeft } from "react-icons/ai";
import { MdDelete, MdAddToPhotos } from "react-icons/md";
import { RiSliceLine } from "react-icons/ri";
import { Toolbar, Typography } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { pink100 } from "material-ui/styles/colors";
import { CirclePicker } from "react-color";

const useStyles = makeStyles((theme) => ({
  iconButton: {
    display: "flex",
    flexDirection: "row"
  }
}));

export const ImprovSpace = () => {
  const { state, dispatch } = useStore();
  const stageEl = React.createRef();
  const layerEl = React.createRef();
  const selectionRectRef = React.createRef();
  const tr = React.createRef();
  const [startCut, setStartCut] = useState(false);
  const [finishedCut, setFinishedCut] = useState(false);
  const [cutPoints, setCutPoints] = useState({
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 }
  });
  const [localTool, setLocalTool] = useState("");
  const [helperText, setHelperText] = useState("");
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [showColors, setShowColors] = useState([]);
  const classes = useStyles();

  function fillHelperText(tool) {
    if (tool === "selecttool") {
      setHelperText("click and drag objects on canvas");
    } else if (tool === "slicetool") {
      setHelperText("click to drag a line over the shapes to place a cut");
    } else if (tool === "sewtool") {
      setHelperText("group pieces");
    } else if (tool === "duplicatetool") {
      setHelperText("copies selected piece");
    } else if (tool === "colortool") {
      setHelperText("select new color scheme");
    } else if (tool === "resizetool") {
      setHelperText("drag corners to resize pieces");
    } else if (tool === "croptool") {
      setHelperText("drag crop corners to crop piece");
    } else if (tool === "redotool") {
      setHelperText("redo last action");
    } else if (tool === "undotool") {
      setHelperText("undo last action");
    } else if (tool === "deletetool") {
      setHelperText("delete selected element");
    } else {
      setHelperText("");
    }
  }

  function handleHover(ev) {
    var tool = ev.currentTarget.value;
    fillHelperText(tool);
  }

  function handleClickButton(ev) {
    var tool = ev.currentTarget.value;
    setLocalTool(tool);

    if (tool == "duplicatetool") {
      handleDuplicate();
    }
    if (tool == "colortool") {
      showColorChoices();
    }
    dispatch({
      type: "selectTool",
      message: "selectTool",
      tool: tool
    });
  }

  function handleDuplicate() {
    dispatch({
      type: "duplicatePieces",
      message: "duplicatePieces"
    });
    dispatch({
      type: "addCommand",
      message: "addCommand",
      command: "duplicate",
      stage: stageEl.current.toJSON()
    });
  }

  function handleRecolor() {
    setShowColorPalette(true);
  }

  function getColorsFromFabrics() {
    var colors = [];
    Object.keys(state.fabrics).map((keyName, i) => {
      var fabric = state.fabrics[keyName];
      colors.push(fabric.color);
    });
    if (colors.length < 1) {
      return ["#f44336", "#e91e63", "#9c27b0", "#673ab7"];
    }
    return colors;
  }

  function selectNewColor(color, pgId, pieceId) {
    console.log("colorpg", state.selectedShapes);
    setShowColors([]);
    dispatch({
      type: "recolorPieceGroup",
      message: "recolorPieceGroup",
      whichPieceGroup: pgId,
      whichPiece: pieceId,
      color: color.hex
    });
    dispatch({
      type: "addCommand",
      message: "addCommand",
      command: "recolor",
      stage: stageEl.current.toJSON()
    });
  }

  function showColorChoices() {
    var newShowColors = JSON.parse(JSON.stringify(showColors));
    for (var i = 0; i < state.selectedShapes.length; i++) {
      var pgId = state.selectedShapes[i];
      if (newShowColors.includes(pgId)) {
        newShowColors = newShowColors.filter((item) => item !== pgId);
        setShowColors(newShowColors);
      } else {
        newShowColors.push(pgId);
        setShowColors(newShowColors);
      }
    }
  }

  function createButton(tool) {
    var symbol;
    var buttonText;
    var disabledOne = false;
    var disabledTwo = false;
    if (tool == "selecttool") {
      buttonText = "select";
      symbol = <GiArrowCursor />;
    } else if (tool == "slicetool") {
      buttonText = "cut";
      symbol = <RiSliceLine />;
      disabledOne = true;
    } else if (tool == "sewtool") {
      buttonText = "sew";
      symbol = <GiSewingNeedle />;
      disabledTwo = true;
    } else if (tool == "duplicatetool") {
      buttonText = "duplicate";
      symbol = <MdAddToPhotos />;
      disabledOne = true;
    } else if (tool == "colortool") {
      buttonText = "recolor";
      symbol = <PaletteIcon />;
      disabledOne = true;
    } else if (tool == "resizeTool") {
      buttonText = "resize";
      symbol = <GiResize />;
      disabledOne = true;
    } else if (tool == "croptool") {
      buttonText = "crop";
      symbol = <CropIcon />;
      disabledOne = true;
    } else if (tool == "redotool") {
      buttonText = "redo";
      symbol = <GrRedo />;
    } else if (tool == "undotool") {
      buttonText = "undo";
      symbol = <GrUndo />;
    } else if (tool == "deletetool") {
      buttonText = "delete";
      symbol = <MdDelete />;
      disabledOne = true;
    }
    if (disabledOne) {
      return (
        <IconButton
          classes={{ label: classes.iconButton }}
          className={state.tool === tool ? "icbutton" : "IconButton"}
          value={tool}
          onClick={(e) => handleClickButton(e)}
          onMouseEnter={(e) => handleHover(e)}
          onMouseOut={(e) => fillHelperText("")}
          selected={state.tool === tool}
          disabled={state.selectedShapes.length < 1}
        >
          {symbol}
          <div>{buttonText}</div>
        </IconButton>
      );
    } else if (disabledTwo) {
      return (
        <IconButton
          classes={{ label: classes.iconButton }}
          className={state.tool === tool ? "icbutton" : "IconButton"}
          value={tool}
          onClick={(e) => handleClickButton(e)}
          onMouseEnter={(e) => handleHover(e)}
          onMouseOut={(e) => fillHelperText("")}
          selected={state.tool === tool}
          disabled={state.selectedShapes.length < 2}
        >
          {symbol}
          <div>{buttonText}</div>
        </IconButton>
      );
    } else {
      return (
        <IconButton
          classes={{ label: classes.iconButton }}
          className={state.tool === tool ? "icbutton" : "IconButton"}
          value={tool}
          onClick={(e) => handleClickButton(e)}
          onMouseEnter={(e) => handleHover(e)}
          onMouseOut={(e) => fillHelperText("")}
          selected={state.tool === tool}
        >
          {symbol}
          <div>{buttonText}</div>
        </IconButton>
      );
    }
  }

  function getRelativePointerPosition(node) {
    //this function will return pointer position relative to the passed node
    var transform = node.getAbsoluteTransform().copy();
    // to detect relative position we need to invert transform
    transform.invert();

    // get pointer (say mouse or touch) position
    var pos = node.getStage().getPointerPosition();

    // now we can find relative point
    return transform.point(pos);
  }

  function handleStageMouseDown(e) {
    e.preventDefault;
    console.log("mouse down");
    console.log(state.tool);
    if (state.tool == "slicetool") {
      beginCut(e);
    }
  }

  function handleStageMouseMove(e) {
    console.log("mouse move");
    if (state.tool == "slicetool") {
      moveCut(e);
    }
  }

  function handleStageMouseUp(e) {
    console.log("mouse up");
    if (state.tool == "slicetool") {
      endCut(e);
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
        state.selectedShapes.map((pgId, i) => {
          if (piecesToSew.indexOf(pgId) < 0) {
            piecesToSew.push(pgId);
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
    if (state.tool == "sewtool") {
      handleSew();
    } else if (state.tool == "slicetool") {
      moveCut();
    }
  }

  function beginCut(e) {
    if (!startCut) {
      var pos = getRelativePointerPosition(layerEl.current);
      var start = { x: pos.x, y: pos.y };
      setStartCut(true);
      setFinishedCut(false);
      setCutPoints({ start: start, end: start });
    }
  }

  function moveCut(e) {
    if (startCut) {
      var pos = getRelativePointerPosition(layerEl.current);
      setCutPoints({
        start: cutPoints.start,
        end: { x: pos.x, y: pos.y }
      });
    }
  }

  function endCut(e) {
    if (startCut) {
      var pos = getRelativePointerPosition(layerEl.current);
      setCutPoints({
        start: cutPoints.start,
        end: { x: pos.x, y: pos.y }
      });
      cutPieceFn(cutPoints.start, cutPoints.end);
      setStartCut(false);
      setFinishedCut(true);
      setCutPoints({
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 }
      });
      dispatch({
        type: "selectTool",
        message: "selectTool",
        tool: "selecttool"
      });
    }
  }

  function cutPieceFn(lineStart, lineEnd) {
    //find all the visible shapes
    var shapes = stageEl.current.find(".improvShape");
    var selectedShapes = shapes.filter((shape) => shape.id());
    var splitPiece = false;
    selectedShapes.forEach((element) => {
      var t = element.getAbsoluteTransform().getTranslation();
      console.log(t);
      var xOffset = t.x;
      var yOffset = t.y;
      var name = element.id();
      var i = name.split("-")[1];
      var j = name.split("-")[2];
      var data = element.data();
      var path = { type: "path", d: data };
      data = toPoints(path);
      console.log(data, lineStart, lineEnd, xOffset, yOffset);
      var absoluteTransform = element.getAbsoluteTransform().decompose();
      console.log(absoluteTransform);
      console.log(element.x() + xOffset, element.y() + yOffset);
      var newBoundaries = splitShape(
        data,
        lineStart,
        lineEnd,
        xOffset,
        yOffset
      );
      console.log(newBoundaries);
      if (Object.keys(newBoundaries).length == 2) {
        var replacePiece = state.pieceGroups[i].pieceData[j];
        replacePiece.scaledBoundary = newBoundaries[0];
        replacePiece.svg = boundaryToSVG(newBoundaries[0]);
        replacePiece.x = element.x();
        replacePiece.y = element.y();

        var newPiece = Object.assign({}, replacePiece);
        newPiece.scaledBoundary = newBoundaries[1];
        newPiece.svg = boundaryToSVG(newBoundaries[1]);
        newPiece.x = absoluteTransform.x;
        newPiece.y = absoluteTransform.y; //need to get transformation

        splitPiece = true;

        var json = stageEl.current.toJSON();
        var newData = {};
        var dataURL = stageEl.current.toDataURL();

        var shapes = stageEl.current.find(".improvShape");
        var selectedShapes = shapes.filter((shape) => shape.isVisible());
        var maxX = 0;
        var maxY = 0;
        selectedShapes.forEach((element) => {
          var rect = element.getClientRect();
          var x = rect.x + rect.width;
          var y = rect.y + rect.height;
          console.log(x, y);
          if (x > maxX) {
            maxX = x;
          }
          if (y > maxY) {
            maxY = y;
          }
        });
        console.log(selectedShapes);

        dispatch({
          type: "cutPiece",
          message: "cutPiece",
          replacePiece: replacePiece,
          whichPieceGroup: i,
          whichPiece: j,
          newPiece: newPiece
        });
      }
    });
    if (!splitPiece) {
      console.log("didn't split piece");
    }
  }

  return (
    <>
      <div className="ToolBar">
        <Toolbar position="static">
          <Typography
            style={{ borderRight: "0.1em solid black", padding: "0.5em" }}
          >
            {createButton("selecttool")}
            {createButton("slicetool")}
            {createButton("sewtool")}
            {createButton("duplicatetool")}
            {createButton("colortool")}
            {createButton("resizetool")}
            {createButton("croptool")}
          </Typography>
          <Typography
            style={{
              padding: "0.5em",
              textAlign: "right"
            }}
          >
            {createButton("redotool")}
            {createButton("undotool")}
            {createButton("deletetool")}
          </Typography>
        </Toolbar>
        <p className="helperText">{helperText}</p>
        <p className="errorMessage">{state.errorMessage}</p>
        {Object.keys(state.pieceGroups).map((keyName, i) => (
          <div key={"colorpg-" + keyName}>
            {Object.keys(state.pieceGroups[keyName].pieceData).map(
              (pieceName, j) => (
                <div key={"colorpick-" + keyName + "-" + pieceName}>
                  {showColors.includes(keyName) && (
                    <div id={"colorrect-" + keyName + "-" + pieceName}>
                      <Stage width={30} height={30}>
                        <Layer>
                          <Rect
                            key={"cprect-" + keyName + "-" + pieceName}
                            width={28}
                            height={28}
                            x={0}
                            y={0}
                            fill={
                              state.pieceGroups[keyName].pieceData[pieceName]
                                .color
                            }
                          />
                        </Layer>
                      </Stage>

                      <CirclePicker
                        colors={getColorsFromFabrics(keyName, pieceName)}
                        onChange={(e) => selectNewColor(e, keyName, pieceName)}
                      />
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        ))}
      </div>
      <div className="improvStage">
        <Stage
          key="improvStage"
          width={1000}
          height={800}
          onDblClick={handleDoubleClick}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          ref={stageEl}
          onMouseDown={handleStageMouseDown}
          onMouseUp={handleStageMouseUp}
        >
          <Layer ref={layerEl}>
            {Object.keys(state.pieceGroups).map((keyName, i) => {
              return (
                <Group
                  name={"improvGroup"}
                  id={keyName}
                  key={keyName}
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
                        data={
                          state.pieceGroups[keyName].pieceData[pieceName].svg
                        }
                        fill={
                          state.pieceGroups[keyName].pieceData[pieceName].color
                        }
                        opacity={state.pieceGroups[keyName].isReal ? 0.9 : 0.5}
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
            {(startCut || finishedCut) && state.tool == "slicetool" && (
              <>
                <Circle
                  x={cutPoints.end.x}
                  y={cutPoints.end.y}
                  id={"endcut"}
                  radius={6}
                  fill={"red"}
                />
                <Circle
                  x={cutPoints.start.x}
                  y={cutPoints.start.y}
                  id={"startcut"}
                  radius={6}
                  fill={"green"}
                />
                <Line
                  x={0}
                  y={0}
                  class={"cutLine"}
                  id={"cutLine"}
                  points={[
                    cutPoints.start.x,
                    cutPoints.start.y,
                    cutPoints.end.x,
                    cutPoints.end.y
                  ]}
                  stroke={"purple"}
                  strokeWidth={4}
                />
              </>
            )}
          </Layer>
        </Stage>
      </div>
    </>
  );
};
