import React from "react";
import CropIcon from "@material-ui/icons/Crop";
import PaletteIcon from "@material-ui/icons/Palette";
import { GiResize, GiArrowCursor, GiSewingNeedle } from "react-icons/gi";
import { GrUndo } from "react-icons/gr";
import { AiOutlineRotateLeft } from "react-icons/ai";
import { MdDelete, MdAddToPhotos } from "react-icons/md";
import { RiSliceLine } from "react-icons/ri";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";

export default class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tool: "potato" };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick = ev => {
    this.setState({
      // Retrieve a passed parameter 'value' attribute
      tool: ev.currentTarget.value
    });
  };

  render() {
    return (
      <div className="App">
        <Toolbar position="static">
          <IconButton value="selecttool" onClick={this.handleClick}>
            <GiArrowCursor />
          </IconButton>
          <IconButton value="rotatetool" onClick={this.handleClick}>
            <AiOutlineRotateLeft />
          </IconButton>
          <IconButton value="slicetool" onClick={this.handleClick}>
            <RiSliceLine />
          </IconButton>
          <IconButton value="sewtool" onClick={this.handleClick}>
            <GiSewingNeedle />
          </IconButton>
          <IconButton value="duplicatetool" onClick={this.handleClick}>
            <MdAddToPhotos />
          </IconButton>
          <IconButton value="colortool" onClick={this.handleClick}>
            <PaletteIcon />
          </IconButton>

          <IconButton value="resizetool" onClick={this.handleClick}>
            <GiResize />
          </IconButton>

          <IconButton value="croptool" onClick={this.handleClick}>
            <CropIcon />
          </IconButton>
          <IconButton value="undoTool" onClick={this.handleClick}>
            <GrUndo />
          </IconButton>
          <IconButton value="deleteTool" onClick={this.handleClick}>
            <MdDelete />
          </IconButton>
        </Toolbar>

        <h1>Hello CodeSandbox</h1>
        <h2>Start editing to see some magic happen!</h2>
      </div>
    );
  }
}
