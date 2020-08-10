import React from "react";
import { useStore } from "./store";

export const Layout = () => {
  const { state, dispatch } = useStore();

  return <div className="layoutDiv" />;
};
