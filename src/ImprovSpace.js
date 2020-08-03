import React, { useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Konva from "konva";
import { Stage, Layer, Path, Group, Line, Rect } from "react-konva";
import Button from "@material-ui/core/Button";
import { useStore } from "./store";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { toPoints } from "svg-points";
import { splitShape, boundaryToSVG, closestEdgeToPoint } from "./helpers";
import ImprovTransformer from "./ImprovTransformer";

export const ImprovSpace = () => {
  const { state, dispatch } = useStore();
  const stageEl = React.createRef();
  const layerEl = React.createRef();
  const selectionRectangle = React.createRef();
  const tr = React.createRef();

  var startCut = [];
  var startedCut = false;
  const [cutPoints, setCutPoints] = useState([]);
  const [readyToGroup, setReadyToGroup] = useState(false);
  const [selectedMode, setMode] = useState("design");
  const [transforms, setTransforms] = useState({});

  const [ready, setReady] = useState(false);

  var x1, y1, x2, y2;
};
