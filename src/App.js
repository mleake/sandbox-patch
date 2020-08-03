import React from "react";
import "./styles.css";
import ToolBar from "./ToolBar";
import { PieceBin } from "./PieceBin";
import { Loader } from "./Loader";
import { StoreProvider } from "./store";
import * as JSONdata from "./data.json";
import { useStore } from "./store";
import { boundaryToSVG, scaleBoundaryToCanvas } from "./helpers";

export default class App extends React.Component {
  componentDidMount() {
    this.setState({ data: JSONdata });
  }

  render() {
    return (
      <div className="App">
        <StoreProvider>
          <Loader data={JSONdata} />
          <ToolBar />
          <PieceBin />
        </StoreProvider>
      </div>
    );
  }
}
