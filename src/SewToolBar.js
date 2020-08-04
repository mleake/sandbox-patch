import React from "react";
import CropIcon from "@material-ui/icons/Crop";
import PaletteIcon from "@material-ui/icons/Palette";
import { GiResize, GiArrowCursor, GiSewingNeedle } from "react-icons/gi";
import { GrUndo } from "react-icons/gr";
// import { AiOutlineRotateLeft } from "react-icons/ai";
import { MdDelete, MdAddToPhotos } from "react-icons/md";
import { RiSliceLine } from "react-icons/ri";
import { Toolbar } from "@material-ui/core";
import IconButton from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { useStore } from "./store";

export const SewToolBar = () => {
  const { state, dispatch } = useStore();

  function handleClick(ev) {
    dispatch({
      type: "selectTool",
      message: "selectTool",
      tool: ev.currentTarget.value
    });
  }

  return (
    <div className="ToolBar">
      <Toolbar position="static">
        <IconButton
          className={state.tool == "selecttool" ? "icbutton" : "IconButton"}
          value="selecttool"
          onClick={e => handleClick(e)}
          selected={true}
        >
          <GiArrowCursor />
        </IconButton>
        <IconButton
          className={state.tool == "slicetool" ? "icbutton" : "IconButton"}
          value="slicetool"
          onClick={e => handleClick(e)}
        >
          <RiSliceLine />
        </IconButton>
        <IconButton
          className={state.tool == "sewtool" ? "icbutton" : "IconButton"}
          value="sewtool"
          onClick={e => handleClick(e)}
        >
          <GiSewingNeedle />
        </IconButton>
        <IconButton
          className={state.tool == "duplicatetool" ? "icbutton" : "IconButton"}
          value="duplicatetool"
          onClick={e => handleClick(e)}
        >
          <MdAddToPhotos />
        </IconButton>
        <IconButton
          className={state.tool == "colortool" ? "icbutton" : "IconButton"}
          value="colortool"
          onClick={e => handleClick(e)}
        >
          <PaletteIcon />
        </IconButton>

        <IconButton
          className={state.tool == "resizetool" ? "icbutton" : "IconButton"}
          value="resizetool"
          onClick={e => handleClick(e)}
        >
          <GiResize />
        </IconButton>

        <IconButton
          className={state.tool == "croptool" ? "icbutton" : "IconButton"}
          value="croptool"
          onClick={e => handleClick(e)}
        >
          <CropIcon />
        </IconButton>
        <IconButton
          className={state.tool == "undoTool" ? "icbutton" : "IconButton"}
          value="undoTool"
          onClick={e => handleClick(e)}
        >
          <GrUndo />
        </IconButton>
        <IconButton
          className={state.tool == "deleteTool" ? "icbutton" : "IconButton"}
          value="deleteTool"
          onClick={e => handleClick(e)}
        >
          <MdDelete />
        </IconButton>
      </Toolbar>
    </div>
  );
};
