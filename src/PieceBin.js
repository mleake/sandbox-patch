import React from "react";
import { GrDrawer } from "react-icons/gr";
import { IconButton, Checkbox, FormControlLabel } from "@material-ui/core";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useStore } from "./store";

export const PieceBin = () => {
  const { state, dispatch } = useStore();
  const [openPieceBin, setPieceBin] = React.useState(false);

  function handleClick(e) {
    e.preventDefault();
    openPieceBin ? setPieceBin(false) : setPieceBin(true);
  }

  const loadPieceGroup = (event, keyName) => {
    dispatch({
      type: "loadPieceGroup",
      message: "loadPieceGroup",
      whichPiece: keyName
    });
  };

  if (openPieceBin) {
    console.log(state.pieceGroups);
    return (
      <div className="PieceBin">
        <IconButton value="openpiecebin" onClick={(e) => handleClick(e)}>
          <GrDrawer />
        </IconButton>
        <div className="scrolling-wrapper">
          {Object.keys(state.pieceGroups).map((keyName, i) => (
            <div key={"wrapper" + keyName}>
              <svg height="100" width="100" className="card">
                {Object.keys(state.pieceGroups[keyName].pieceData).map(
                  (pieceName, j) => (
                    <path
                      id={"svg-" + keyName + "-" + pieceName}
                      key={"svg-" + keyName + "-" + pieceName}
                      d={state.pieceGroups[keyName].pieceData[pieceName].svg}
                      fill={
                        state.pieceGroups[keyName].pieceData[pieceName].color
                      }
                      stroke="red"
                    />
                  )
                )}
              </svg>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.pieceGroups[keyName].onDesignWall}
                    onChange={(e) => loadPieceGroup(e, keyName)}
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                }
                label="on design wall"
              />
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <IconButton value="openpiecebin" onClick={(e) => handleClick(e)}>
        <GrDrawer />
      </IconButton>
    );
  }
};
