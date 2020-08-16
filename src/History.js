import React, { useState } from "react";
import { useStore } from "./store";
import Konva from "konva";
import {
  Stage,
  Layer,
  Path,
  Group,
  Line,
  Rect,
  Circle,
  Container,
  Node
} from "react-konva";
import { IconButton, Checkbox, FormControlLabel } from "@material-ui/core";

export const History = () => {
  const { state, dispatch } = useStore();

  function commitStep(e, command) {
    dispatch({
      type: "commitStep",
      message: "commitStep",
      commandId: command
    });
  }

  return (
    <div className="HistoryBar">
      <>
        <h1> History </h1>
        {Object.keys(state.commandHistory).map((command, i) => {
          const storedPieceGroups =
            state.commandHistory[command].storedPieceGroups;
          console.log(
            "stored state groups",
            storedPieceGroups,
            state.commandHistory[command].command
          );
          return (
            <div key={"frag-" + i}>
              <h2> {state.commandHistory[command].command} </h2>
              <Stage key={"historyStage-" + i} width={200} height={200}>
                <Layer>
                  {Object.keys(storedPieceGroups).map((keyName, i) => {
                    return (
                      <Group
                        name={"storedImprovGroup"}
                        id={"stored-" + keyName + "-" + i}
                        key={"stored-" + keyName + "-" + i}
                        x={storedPieceGroups[keyName].x}
                        y={storedPieceGroups[keyName].y}
                      >
                        {Object.keys(storedPieceGroups[keyName].pieceData).map(
                          (pieceName, j) => (
                            <Path
                              name={"storedimprovShape"}
                              id={"storedpiece-" + keyName + "-" + pieceName}
                              key={"storedpiece-" + keyName + "-" + pieceName}
                              x={
                                storedPieceGroups[keyName].pieceData[pieceName]
                                  .x
                              }
                              y={
                                storedPieceGroups[keyName].pieceData[pieceName]
                                  .y
                              }
                              data={
                                storedPieceGroups[keyName].pieceData[pieceName]
                                  .svg
                              }
                              fill={
                                storedPieceGroups[keyName].pieceData[pieceName]
                                  .color
                              }
                              opacity={
                                storedPieceGroups[keyName].isReal ? 0.9 : 0.5
                              }
                              visible={
                                storedPieceGroups[keyName].onDesignWall
                                  ? true
                                  : false
                              }
                            />
                          )
                        )}
                      </Group>
                    );
                  })}
                </Layer>
              </Stage>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={false}
                    onChange={(e) => commitStep(e, command)}
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                }
                label="done"
              />
            </div>
          );
        })}
      </>
    </div>
  );
};
