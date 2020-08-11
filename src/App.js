import React from "react";
import { SewToolBar } from "./SewToolBar";
import { PieceBin } from "./PieceBin";
import { Loader } from "./Loader";
import { StoreProvider } from "./store";
import { ImprovSpace } from "./ImprovSpace";
import { Layout } from "./Layout";
import * as JSONdata from "./data.json";
import { Container, Row, Col } from "react-bootstrap";

// import { boundaryToSVG, scaleBoundaryToCanvas } from "./helpers";
import "./styles.css";

export default class App extends React.Component {
  componentDidMount() {
    this.setState({ data: JSONdata });
  }

  render() {
    return (
      <div className="App">
        <StoreProvider>
          <Container>
            <Row>
              <Loader data={JSONdata} />
              <SewToolBar />
            </Row>
            <Row>
              <Col sm={8}>
                <ImprovSpace />
              </Col>
              <Col sm={4}>
                <Layout />
              </Col>
            </Row>
            <Row>
              <PieceBin />
            </Row>
          </Container>
        </StoreProvider>
      </div>
    );
  }
}
