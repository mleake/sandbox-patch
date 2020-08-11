// store.js
import React, { createContext, useContext, useReducer } from "react";

const StoreContext = createContext();
const initialState = {
  message: "",
  pieces: {},
  selectedPieceID: "",
  onDesignWall: {},
  fabrics: {},
  uploadedFile: "",
  pieceGroups: {},
  tool: "selecttool",
  selectedShapes: []
};

const reducer = (state, action) => {
  console.log("in reducer", action);
  switch (action.type) {
    case "reset":
      return {
        message: action.message,
        pieces: {},
        pieceGroups: {},
        selectedPieceID: "",
        fabrics: {},
        onDesignWall: {},
        tool: "selecttool",
        selectedShapes: []
      };

    case "selectTool":
      return {
        message: action.message,
        pieces: state.pieces,
        pieceGroups: state.pieceGroups,
        selectedPieceID: state.selectedPieceID,
        fabrics: state.fabrics,
        onDesignWall: state.onDesignWall,
        tool: action.tool,
        selectedShapes: state.selectedShapes
      };
    case "selectShapes":
      return {
        message: action.message,
        pieces: state.pieces,
        pieceGroups: state.pieceGroups,
        selectedPieceID: state.selectedPieceID,
        fabrics: state.fabrics,
        onDesignWall: state.onDesignWall,
        tool: state.tool,
        selectedShapes: action.selectedShapes
      };
    case "duplicatePieces":
      action.piecesToDuplicate.forEach((element, idx) => {
        var newPieceGroupId = Object.keys(state.pieceGroups).length;

        var newPieceGroup = Object.assign(
          {},
          state.pieceGroups[element.pieceGroup]
        );
        state.pieceGroups[newPieceGroupId] = newPieceGroup;
        state.pieceGroups[newPieceGroupId].idx = newPieceGroupId;
        state.onDesignWall[newPieceGroupId] = true;
        state.pieceGroups[newPieceGroupId].onDesignWall = true;
      });
      return {
        message: action.message,
        pieces: state.pieces,
        pieceGroups: state.pieceGroups,
        selectedPieceID: state.selectedPieceID,
        fabrics: state.fabrics,
        onDesignWall: state.onDesignWall,
        tool: state.tool,
        selectedShapes: state.selectedShapes
      };
    case "sewPieces":
      var newPieceGroupId = Object.keys(state.pieceGroups).length;
      state.pieceGroups[newPieceGroupId] = { pieceData: {} };
      state.pieceGroups[newPieceGroupId].idx = newPieceGroupId;
      state.onDesignWall[newPieceGroupId] = true;
      state.pieceGroups[newPieceGroupId].onDesignWall = true;
      var pieceId = 0;
      action.piecesToSew.forEach((pgIdx, idx) => {
        var currentPieceGroup = state.pieceGroups[pgIdx];

        Object.keys(currentPieceGroup.pieceData).forEach((pieceKey, pidx) => {
          state.pieceGroups[newPieceGroupId].pieceData[pieceId] =
            currentPieceGroup.pieceData[pieceKey];
          state.pieceGroups[newPieceGroupId].pieceData[pieceId].idx = pieceId;
          pieceId += 1;
        });
        delete state.pieceGroups[pgIdx]; //delete whole piece group?
      });
      return {
        message: action.message,
        pieces: state.pieces,
        pieceGroups: state.pieceGroups,
        selectedPieceID: state.selectedPieceID,
        fabrics: state.fabrics,
        onDesignWall: state.onDesignWall,
        tool: state.tool,
        selectedShapes: state.selectedShapes
      };
    case "loadJSON":
      console.log("loading json");
      var idx = 0;
      for (var i = 0; i < Object.keys(action.data.pieceGroups).length; i++) {
        state.pieceGroups[idx] = action.data.pieceGroups[i];
        state.onDesignWall[idx] = false;
        idx += 1;
      }
      return {
        message: action.message,
        pieces: state.pieces,
        pieceGroups: state.pieceGroups,
        selectedPieceID: state.selectedPieceID,
        fabrics: state.fabrics,
        onDesignWall: state.onDesignWall,
        tool: action.tool,
        selectedShapes: state.selectedShapes
      };
    case "addFile":
      console.log("adding file", action.newFile);
      state.uploadedFile = action.newFile;
      return {
        message: action.message,
        pieces: state.pieces,
        pieceGroups: state.pieceGroups,
        uploadedFile: state.uploadedFile,
        fabrics: state.fabrics,
        onDesignWall: state.onDesignWall,
        tool: action.tool,
        selectedShapes: state.selectedShapes
      };
    case "addFabric":
      console.log("adding fabric", action.newColor);
      var newColor = action.newColor;
      var newFabric = {
        width: 100,
        height: 100,
        color: newColor,
        filename: action.filename
      };
      var newIdx = Object.keys(state.fabrics).length;
      console.log(newFabric);
      state.fabrics[newIdx] = newFabric;
      console.log(state);
      return {
        message: action.message,
        pieces: state.pieces,
        pieceGroups: state.pieceGroups,
        uploadedFile: state.uploadedFile,
        fabrics: state.fabrics,
        onDesignWall: state.onDesignWall,
        tool: action.tool,
        selectedShapes: state.selectedShapes
      };
    case "changeFabricDims": {
      var fabric = state.fabrics[action.whichFabric];
      console.log(action.whichFabric, fabric);
      fabric["width"] = action.width;
      fabric["height"] = action.height;
      fabric["label"] = action.label;
      state.fabrics[action.whichFabric] = fabric;
      return {
        message: action.message,
        pieces: state.pieces,
        pieceGroups: state.pieceGroups,
        uploadedFile: state.uploadedFile,
        fabrics: state.fabrics,
        onDesignWall: state.onDesignWall,
        tool: action.tool,
        selectedShapes: state.selectedShapes
      };
    }
    case "addPiece":
      var newPiece = action.newPiece;
      var idx = Object.keys(state.pieces).length;
      state.pieces[idx] = newPiece;
      console.log(state);
      return {
        message: action.message,
        pieces: state.pieces,
        pieceGroups: state.pieceGroups,
        selectedPieceID: state.selectedPieceID,
        fabrics: state.fabrics,
        onDesignWall: state.onDesignWall,
        tool: action.tool,
        selectedShapes: state.selectedShapes
      };
    case "addPieceGroup":
      var newPieceGroups = action.newPieceGroups;
      var idx = Object.keys(state.pieceGroups).length;
      console.log(newPieceGroups);
      for (var i = 0; i < Object.keys(newPieceGroups).length; i++) {
        state.pieceGroups[idx] = newPieceGroups[i];
        state.onDesignWall[idx] = false;
        idx += 1;
      }
      console.log(state);
      return {
        message: action.message,
        pieces: state.pieces,
        pieceGroups: state.pieceGroups,
        selectedPieceID: state.selectedPieceID,
        fabrics: state.fabrics,
        onDesignWall: state.onDesignWall,
        tool: action.tool,
        selectedShapes: state.selectedShapes
      };
    case "loadPieceGroup":
      var keyName = action.whichPiece;
      var currentVis = state.pieceGroups[keyName].onDesignWall;
      var newVis = !currentVis;
      var newODW = state.onDesignWall;
      var newState = { ...state };
      newState.pieceGroups[keyName].onDesignWall = !state.pieceGroups[keyName]
        .onDesignWall;
      newState.onDesignWall[keyName] = !state.pieceGroups[keyName].onDesignWall;
      returnVal = {
        message: action.message,
        pieces: newState.pieces,
        pieceGroups: newState.pieceGroups,
        selectedPieceID: newState.selectedPieceID,
        fabrics: newState.fabrics,
        onDesignWall: newState.onDesignWall,
        loadedPieceGroup: true,
        tool: action.tool,
        selectedShapes: state.selectedShapes
      };
      return returnVal;
    case "selectPiece":
      return {
        message: action.message,
        pieces: state.pieces,
        pieceGroups: state.pieceGroups,
        selectedPieceID: action.selectedPieceID,
        fabrics: state.fabrics,
        onDesignWall: state.onDesignWall,
        tool: action.tool,
        selectedShapes: state.selectedShapes
      };
    case "changePieceWidth":
      var keyName = action.whichPiece;
      state.pieceGroups[keyName].realWidth = action.newWidth;
      return {
        message: action.message,
        pieces: state.pieces,
        pieceGroups: state.pieceGroups,
        uploadedFile: state.uploadedFile,
        fabrics: state.fabrics,
        onDesignWall: state.onDesignWall,
        tool: action.tool,
        selectedShapes: state.selectedShapes
      };
    case "changePieceHeight":
      var keyName = action.whichPiece;
      state.pieceGroups[keyName].realHeight = action.newHeight;
      return {
        message: action.message,
        pieces: state.pieces,
        pieceGroups: state.pieceGroups,
        uploadedFile: state.uploadedFile,
        fabrics: state.fabrics,
        onDesignWall: state.onDesignWall,
        tool: action.tool,
        selectedShapes: state.selectedShapes
      };
    case "movePiece":
      // var newAttrs = action.locations.attrs;
      // state.pieces[newAttrs.name].tempData = newAttrs;
      // console.log(state);
      // return {
      //   message: action.message,
      //   pieces: state.pieces,
      //   pieceGroups: state.pieceGroups,
      //   selectedPieceID: state.selectedPieceID,
      //   fabrics: state.fabrics,
      //   onDesignWall: state.onDesignWall
      return state;
    // };
    case "movePieceGroup":
      state.pieceGroups[action.whichPieceGroup].pieceData[
        action.whichPiece
      ].canvasOffsetX = action.offsetX;
      state.pieceGroups[action.whichPieceGroup].pieceData[
        action.whichPiece
      ].canvasOffsetY = action.offsetY;
      state.pieceGroups[action.whichPieceGroup].pieceData[
        action.whichPiece
      ].rotation = action.rotation;
      console.log(state);
      return {
        message: action.message,
        pieces: state.pieces,
        pieceGroups: state.pieceGroups,
        selectedPieceID: state.selectedPieceID,
        fabrics: state.fabrics,
        onDesignWall: state.onDesignWall,
        tool: action.tool,
        selectedShapes: state.selectedShapes
      };
    case "addSeam":
      var newState = Object.assign({}, state);
      var newPieceGroupId = Object.keys(state.pieceGroups).length;
      newState.pieceGroups[newPieceGroupId] = {};
      newState.pieceGroups[newPieceGroupId].idx = newPieceGroupId;
      newState.pieceGroups[newPieceGroupId].pieceData = {};
      var maxX = 0;
      var minX = 100000;
      var maxY = 0;
      var minY = 100000;
      var width = 100;
      var height = 100;
      action.piecesToMove.forEach((element, idx) => {
        var pgIdx = element.pieceGroup;
        var pIdx = element.piece;
        newState.pieceGroups[newPieceGroupId].pieceData[idx] =
          state.pieceGroups[pgIdx].pieceData[pIdx];
        newState.onDesignWall[pgIdx] = false;
        newState.pieceGroups[newPieceGroupId].maxX =
          state.pieceGroups[pgIdx].maxX;
        newState.pieceGroups[newPieceGroupId].minX =
          state.pieceGroups[pgIdx].minX;
        newState.pieceGroups[newPieceGroupId].maxY =
          state.pieceGroups[pgIdx].maxY;
        newState.pieceGroups[newPieceGroupId].minY =
          state.pieceGroups[pgIdx].minY;
        newState.pieceGroups[newPieceGroupId].width =
          state.pieceGroups[pgIdx].width;
        newState.pieceGroups[newPieceGroupId].height =
          state.pieceGroups[pgIdx].height;
        delete newState.pieceGroups[pgIdx]; //delete whole piece group?
      });
      newState.onDesignWall[newPieceGroupId] = true;
      newState.pieceGroups[newPieceGroupId].onDesignWall = true;

      var returnVal = {
        message: action.message,
        pieces: state.pieces,
        pieceGroups: newState.pieceGroups,
        selectedPieceID: state.selectedPieceID,
        fabrics: state.fabrics,
        onDesignWall: state.onDesignWall,
        addedSeam: true,
        tool: action.tool,
        selectedShapes: state.selectedShapes
      };
      state = Object.assign({}, returnVal);
      console.log(state);
      return state;
    case "duplicatePieceGroup":
      var newPieceGroupId = Object.keys(state.pieceGroups).length;
      var newPieceGroup = Object.assign(
        {},
        state.pieceGroups[action.whichPieceGroup]
      );
      newPieceGroup.idx = newPieceGroupId;
      state.pieceGroups[newPieceGroupId] = newPieceGroup;
      var returnVal = {
        message: action.message,
        pieces: state.pieces,
        pieceGroups: state.pieceGroups,
        selectedPieceID: state.selectedPieceID,
        fabrics: state.fabrics,
        onDesignWall: state.onDesignWall,
        addedSeam: true,
        tool: action.tool,
        selectedShapes: state.selectedShapes
      };
      state = returnVal;
      console.log(state);
      return returnVal;
    case "recolorPieceGroup":
      var pieces = state.pieceGroups[action.whichPieceGroup].pieceData;
      pieces[action.whichPiece].color = action.color;
      var returnVal = {
        message: action.message,
        pieces: state.pieces,
        pieceGroups: state.pieceGroups,
        selectedPieceID: state.selectedPieceID,
        fabrics: state.fabrics,
        onDesignWall: state.onDesignWall,
        recoloredPieceGroup: true,
        tool: action.tool,
        selectedShapes: state.selectedShapes
      };
      state = returnVal;
      console.log(state);
      return returnVal;
    case "cutPiece":
      console.log(action.replacePiece, action.newPiece);
      var newState = Object.assign({}, state);
      //add newPiece
      var newPieceGroupId = Object.keys(state.pieceGroups).length;
      newState.pieceGroups[newPieceGroupId] = {};
      newState.pieceGroups[newPieceGroupId].idx = newPieceGroupId;
      newState.pieceGroups[newPieceGroupId].pieceData = {};
      newState.pieceGroups[newPieceGroupId].pieceData[0] = action.newPiece;
      newState.pieceGroups[newPieceGroupId].onDesignWall = true;
      newState.pieceGroups[newPieceGroupId].width =
        newState.pieceGroups[action.whichPieceGroup].width;
      newState.pieceGroups[newPieceGroupId].height =
        newState.pieceGroups[action.whichPieceGroup].height;
      newState.onDesignWall[newPieceGroupId] = true;
      //replacePiece with half
      newState.pieceGroups[action.whichPieceGroup].pieceData[
        action.whichPiece
      ] = action.replacePiece;
      newState.onDesignWall[action.whichPieceGroup] = true;
      state = newState;
      console.log("after", state);
      return {
        message: action.message,
        pieces: state.pieces,
        pieceGroups: state.pieceGroups,
        selectedPieceID: state.selectedPieceID,
        fabrics: state.fabrics,
        onDesignWall: state.onDesignWall,
        tool: action.tool,
        selectedShapes: state.selectedShapes
      };
    case "finishEdit":
      // for (var i=0; i<Object.keys(state.pieces).length; i++) {
      //   var pieceKey = Object.keys(state.pieces)[i];
      //   if (Object.keys(state.pieces[pieceKey]).indexOf("tempData") > -1) {
      //     var tempData = state.pieces[pieceKey].tempData
      //     console.log("updating piece ", pieceKey)
      //     state.pieces[pieceKey].offsetX = tempData.x;
      //     state.pieces[pieceKey].offsetY = tempData.y;
      //     state.pieces[pieceKey].scaleX = tempData.scaleX;
      //     state.pieces[pieceKey].scaleY = tempData.scaleY;
      //     state.pieces[pieceKey].rotation = tempData.rotation;
      //   }
      // }
      action.newAttrs.forEach((element) => {
        var pg = element.whichPieceGroup;
        var p = element.whichPiece;
        state.pieceGroups[pg].pieceData[p].x = element.x;
        state.pieceGroups[pg].pieceData[p].y = element.y;
        state.pieceGroups[pg].pieceData[p].rotation = element.rotation;
      });
      console.log("finish state", state);
      return {
        message: action.message,
        pieces: state.pieces,
        pieceGroups: state.pieceGroups,
        selectedPieceID: state.selectedPieceID,
        fabrics: state.fabrics,
        uploadedFile: state.uploadedFile,
        onDesignWall: state.onDesignWall,
        tool: action.tool,
        selectedShapes: state.selectedShapes
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
