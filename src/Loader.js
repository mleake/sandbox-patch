import React from "react";
import Button from "@material-ui/core/Button";
import { useStore } from "./store";

import * as JSONdata from "./data.json";

export const Loader = () => {
  const { state, dispatch } = useStore();

  function loadData() {
    console.log("here");
    dispatch({
      type: "loadJSON",
      message: "loadJSON",
      data: JSONdata
    });
    // setReady(true);
    console.log(state);
  }
  return (
    <Button value="load" onClick={e => loadData(e)}>
      Load
    </Button>
  );
};
