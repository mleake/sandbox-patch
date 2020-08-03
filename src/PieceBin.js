import React from "react";
import { GrDrawer } from "react-icons/gr";
import IconButton from "@material-ui/core/IconButton";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useStore } from "./store";
import { Stage, Layer, Path, Group } from "react-konva";

export const PieceBin = () => {
  const { state, dispatch } = useStore();
  const [openPieceBin, setPieceBin] = React.useState(false);

  function handleClick(e) {
    e.preventDefault();
    openPieceBin ? setPieceBin(false) : setPieceBin(true);
  }

  if (openPieceBin) {
    console.log(state.pieceGroups);
    return (
      <div className="PieceBin">
        <Container>
          <Row>
            <Col>
              <IconButton value="openpiecebin" onClick={e => handleClick(e)}>
                <GrDrawer />
              </IconButton>
            </Col>
            <>
              {Object.keys(state.pieceGroups).map((keyName, i) => (
                <Col>
                  <Stage width={300} height={150}>
                    <Layer>
                      <Group>
                        {Object.keys(state.pieceGroups[keyName].pieceData).map(
                          (pieceName, j) => (
                            <Path
                              data={
                                state.pieceGroups[keyName].pieceData[pieceName]
                                  .svg
                              }
                              fill={
                                state.pieceGroups[keyName].pieceData[pieceName]
                                  .color
                              }
                              x={0}
                              y={0}
                            />
                          )
                        )}
                      </Group>
                    </Layer>
                  </Stage>
                </Col>
              ))}
            </>
          </Row>
        </Container>
      </div>
    );
  } else {
    return (
      <IconButton value="openpiecebin" onClick={e => handleClick(e)}>
        <GrDrawer />
      </IconButton>
    );
  }
};
