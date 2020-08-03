import React from "react";
import "./styles.css";
import ToolBar from "./ToolBar";
import { Loader } from "./Loader";
import { PieceBin } from "./PieceBin";
// import { ImprovSpace } from "./ImprovSpace";
import { StoreProvider } from "./store";

export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <StoreProvider>
          <Loader />
          <ToolBar />
          <PieceBin />
        </StoreProvider>
      </div>
    );
  }
}
