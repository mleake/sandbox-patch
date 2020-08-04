import React from "react";
import { SewToolBar } from "./SewToolBar";
import { PieceBin } from "./PieceBin";
import { Loader } from "./Loader";
import { StoreProvider } from "./store";
import { ImprovSpace } from "./ImprovSpace";
import * as JSONdata from "./data.json";

import { boundaryToSVG, scaleBoundaryToCanvas } from "./helpers";
import "./styles.css";

export default class App extends React.Component {
  componentDidMount() {
    this.setState({ data: JSONdata });
  }

  render() {
    return (
      <div className="App">
        <StoreProvider>
          <Loader data={JSONdata} />
          <SewToolBar />
          <ImprovSpace />
          <PieceBin />
        </StoreProvider>
      </div>
    );
  }
}
