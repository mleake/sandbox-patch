import React, { useState } from "react";
import CropIcon from "@material-ui/icons/Crop";
import PaletteIcon from "@material-ui/icons/Palette";
import { GiResize, GiArrowCursor, GiSewingNeedle } from "react-icons/gi";
import { GrUndo, GrRedo } from "react-icons/gr";
// import { AiOutlineRotateLeft } from "react-icons/ai";
import { MdDelete, MdAddToPhotos } from "react-icons/md";
import { RiSliceLine } from "react-icons/ri";
import { Toolbar, Typography } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { useStore } from "./store";

const useStyles = makeStyles((theme) => ({
  iconButton: {
    display: "flex",
    flexDirection: "row"
  }
}));

export const SewToolBar = () => {
  const { state, dispatch } = useStore();
  const [localTool, setLocalTool] = useState("");
  const [helperText, setHelperText] = useState("");
  const classes = useStyles();

  function fillHelperText(tool) {
    if (tool === "selecttool") {
      setHelperText("click and drag objects on canvas");
    } else if (tool === "slicetool") {
      setHelperText("click to drag a line over the shapes to place a cut");
    } else if (tool === "sewtool") {
      setHelperText("click and drag selection rectangle to group elements");
    } else if (tool === "duplicatetool") {
      setHelperText("copies selected piece");
    } else if (tool === "colortool") {
      setHelperText("select new color scheme");
    } else if (tool === "resizetool") {
      setHelperText("drag corners to resize pieces");
    } else if (tool === "croptool") {
      setHelperText("drag crop corners to crop piece");
    } else if (tool === "redotool") {
      setHelperText("redo last action");
    } else if (tool === "undotool") {
      setHelperText("undo last action");
    } else if (tool === "deletetool") {
      setHelperText("delete selected element");
    }
  }

  function handleHover(ev) {
    var tool = ev.currentTarget.value;
    fillHelperText(tool);
  }

  function handleClick(ev) {
    var tool = ev.currentTarget.value;
    setLocalTool(tool);
    dispatch({
      type: "selectTool",
      message: "selectTool",
      tool: tool
    });
  }

  return (
    <div className="ToolBar">
      <Toolbar position="static">
        <Typography
          style={{ borderRight: "0.1em solid black", padding: "0.5em" }}
        >
          <IconButton
            classes={{ label: classes.iconButton }}
            className={state.tool === "selecttool" ? "icbutton" : "IconButton"}
            value="selecttool"
            onClick={(e) => handleClick(e)}
            selected={state.tool === "selecttool"}
          >
            <GiArrowCursor />
            <div>select</div>
          </IconButton>

          <IconButton
            classes={{ label: classes.iconButton }}
            className={state.tool === "slicetool" ? "icbutton" : "IconButton"}
            value="slicetool"
            onClick={(e) => handleClick(e)}
            selected={state.tool === "slicetool"}
          >
            <RiSliceLine />
            <div>cut</div>
          </IconButton>

          <IconButton
            classes={{ label: classes.iconButton }}
            className={state.tool === "sewtool" ? "icbutton" : "IconButton"}
            value="sewtool"
            onClick={(e) => handleClick(e)}
            selected={false}
            disabled={state.selectedShapes.length < 2}
          >
            <GiSewingNeedle />
            <div>sew</div>
          </IconButton>

          <IconButton
            classes={{ label: classes.iconButton }}
            className={
              state.tool === "duplicatetool" ? "icbutton" : "IconButton"
            }
            value="duplicatetool"
            onClick={(e) => handleClick(e)}
            selected={false}
            disabled={state.selectedShapes.length < 1}
          >
            <MdAddToPhotos />
            <div>duplicate</div>
          </IconButton>

          <IconButton
            classes={{ label: classes.iconButton }}
            className={state.tool === "colortool" ? "icbutton" : "IconButton"}
            value="colortool"
            onClick={(e) => handleClick(e)}
            selected={true}
          >
            <PaletteIcon />
            <div>recolor</div>
          </IconButton>

          <IconButton
            classes={{ label: classes.iconButton }}
            className={state.tool === "resizetool" ? "icbutton" : "IconButton"}
            value="resizetool"
            onClick={(e) => handleClick(e)}
            selected={true}
          >
            <GiResize />
            <div>resize</div>
          </IconButton>

          <IconButton
            classes={{ label: classes.iconButton }}
            className={state.tool === "croptool" ? "icbutton" : "IconButton"}
            value="croptool"
            onClick={(e) => handleClick(e)}
            selected={true}
          >
            <CropIcon />
            <div>crop</div>
          </IconButton>
        </Typography>
        <Typography
          style={{
            padding: "0.5em",
            textAlign: "right"
          }}
        >
          <IconButton
            classes={{ label: classes.iconButton }}
            className={state.tool === "redoTool" ? "icbutton" : "IconButton"}
            value="redotool"
            onClick={(e) => handleClick(e)}
            selected={true}
          >
            <GrRedo />
            <div>redo</div>
          </IconButton>

          <IconButton
            classes={{ label: classes.iconButton }}
            className={state.tool === "undoTool" ? "icbutton" : "IconButton"}
            value="undotool"
            onClick={(e) => handleClick(e)}
            selected={true}
          >
            <GrUndo />
            <div>undo</div>
          </IconButton>

          <IconButton
            classes={{ label: classes.iconButton }}
            className={state.tool === "deleteTool" ? "icbutton" : "IconButton"}
            value="deletetool"
            onClick={(e) => handleClick(e)}
            selected={true}
          >
            <MdDelete />
            <div>delete</div>
          </IconButton>
        </Typography>
      </Toolbar>
      <p className="helperText">{helperText}</p>
      {localTool === "slicetool" ? <Button>cut</Button> : null}
    </div>
  );
};
