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
  selectedShapes: [],
  errorMessage: "",
  commandHistory: {},
  undoneCommands: [],
  fullHistory: {}
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
        selectedShapes: [],
        errorMessage: "",
        commandHistory: {},
        undoneCommands: [],
        fullHistory: {}
      };

    case "selectTool":
      var newState = Object.assign({}, state);
      newState.tool = action.tool;
      newState.message = action.message;
      return newState;
    case "addCommand":
      var commandId = Object.keys(state.commandHistory).length;
      var fhId = Object.keys(state.fullHistory).length;
      var newCommandHistory = Object.assign({}, state.commandHistory);
      var newFullHistory = Object.assign({}, state.fullHistory);
      newCommandHistory[commandId] = {
        command: action.command,
        storedPieceGroups: JSON.parse(JSON.stringify(state.pieceGroups)),
        affectedPieceGroups: [...state.selectedShapes]
      };
      newFullHistory[fhId] = {
        command: action.command,
        storedPieceGroups: JSON.parse(JSON.stringify(state.pieceGroups)),
        affectedPieceGroups: [...state.selectedShapes]
      };
      state.commandHistory = newCommandHistory;
      state.fullHistory = newFullHistory;
      state.selectedShapes = [];
      console.log("adding command", state.commandHistory);
      return state;
    case "commitStep":
      var command = state.commandHistory[action.commandId];
      var pieceGroups = command.affectedPieceGroups;
      console.log(pieceGroups);
      pieceGroups.forEach((pgId, i) => {
        state.pieceGroups[pgId].isReal = true;
      });
      var newCommandHistory = {};
      for (var i = 0; i < Object.keys(state.commandHistory).length; i++) {
        var cid = Object.keys(state.commandHistory)[i];
        if (cid != action.commandId) {
          newCommandHistory[cid] = state.commandHistory[cid];
        }
      }
      state.commandHistory = newCommandHistory;
      console.log("in commit", newCommandHistory, state);
      var newState = JSON.parse(JSON.stringify(state));
      return newState;
    case "displayError":
      state.errorMessage = action.errorMessage;
      return state;
    case "selectShapes":
      var newState = Object.assign({}, state);
      newState.selectedShapes = action.selectedShapes;
      newState.message = action.message;
      return newState;
    case "duplicatePieces":
      var newPgs = [];
      state.selectedShapes.forEach((pgId, idx) => {
        var newPieceGroupId = Object.keys(state.pieceGroups).length.toString();
        var newPieceGroup = JSON.parse(JSON.stringify(state.pieceGroups[pgId]));
        state.pieceGroups[newPieceGroupId] = newPieceGroup;
        state.pieceGroups[newPieceGroupId].idx = newPieceGroupId;
        state.onDesignWall[newPieceGroupId] = true;
        state.pieceGroups[newPieceGroupId].onDesignWall = true;
        state.pieceGroups[newPieceGroupId].isReal = false;
        newPgs.push(newPieceGroupId);
      });
      var newSelectedShapes = [...state.selectedShapes];
      newPgs.forEach((pg) => {
        newSelectedShapes.push(pg);
      });
      state.selectedShapes = newSelectedShapes;
      state.message = action.message;
      console.log("IN DUPL", state.selectedShapes);
      return state;
    case "sewPieces":
      state.message = action.message;
      var newState = JSON.parse(JSON.stringify(state));
      var oldPg = [];
      action.changes.forEach((change, idx) => {
        var pieceData = JSON.parse(
          JSON.stringify(state.pieceGroups[change.oldPg].pieceData[change.oldP])
        );

        newState.pieceGroups[change.newPg].pieceData[change.newP] = pieceData;
        newState.pieceGroups[change.newPg].pieceData[change.newP].x =
          change.newPos.x;
        newState.pieceGroups[change.newPg].pieceData[change.newP].y =
          change.newPos.y;
        newState.pieceGroups[change.newPg].isReal = false;
        if (oldPg.indexOf(change.oldPg) < 0) {
          oldPg.push(change.oldPg);
        }
      });
      oldPg.forEach((pgId) => {
        delete newState.pieceGroups[pgId];
      });
      console.log("in sew pieces STATE", newState);
      return newState;
    case "loadJSON":
      console.log("loading json");
      var idx = 0;
      for (var i = 0; i < Object.keys(action.data.pieceGroups).length; i++) {
        state.pieceGroups[idx] = action.data.pieceGroups[i];
        state.onDesignWall[idx] = false;
        idx += 1;
      }
      state.message = action.message;
      return state;
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
      state.message = action.message;
      return state;
    case "changeFabricDims":
      var fabric = state.fabrics[action.whichFabric];
      console.log(action.whichFabric, fabric);
      fabric["width"] = action.width;
      fabric["height"] = action.height;
      fabric["label"] = action.label;
      state.fabrics[action.whichFabric] = fabric;
      state.message = action.message;
      return state;
    case "addPieceGroup":
      var newPieceGroups = action.newPieceGroups;
      var idx = Object.keys(state.pieceGroups).length;
      console.log(newPieceGroups);
      for (var i = 0; i < Object.keys(newPieceGroups).length; i++) {
        state.pieceGroups[idx] = newPieceGroups[i];
        state.pieceGroups[idx].x = 0;
        state.pieceGroups[idx].y = 0;
        state.pieceGroups[idx].isReal = true;
        state.onDesignWall[idx] = false;
        idx += 1;
      }
      console.log(state);
      state.message = action.message;
      return state;
    case "loadPieceGroup":
      var keyName = action.whichPiece;
      var currentVis = state.pieceGroups[keyName].onDesignWall;
      var newVis = !currentVis;
      var newODW = state.onDesignWall;
      var newState = { ...state };
      newState.pieceGroups[keyName].onDesignWall = !state.pieceGroups[keyName]
        .onDesignWall;
      newState.onDesignWall[keyName] = !state.pieceGroups[keyName].onDesignWall;
      newState.message = action.message;
      return newState;
    case "updatePositions":
      var newState = JSON.parse(JSON.stringify(state));
      console.log(action.changes);
      // action.changes.forEach((change) => {
      //   newState.pieceGroups[change.pgId].pieceData[change.pid].x =
      //     change.pos.x;
      //   newState.pieceGroups[change.pgId].pieceData[change.pid].x =
      //     change.pos.y;
      // });
      newState.pieceGroups[action.whichPieceGroup].x = action.pos.x;
      newState.pieceGroups[action.whichPieceGroup].y = action.pos.y;
      return newState;
    // case "movePieceGroup":
    //   state.pieceGroups[action.whichPieceGroup].pieceData[
    //     action.whichPiece
    //   ].canvasOffsetX = action.offsetX;
    //   state.pieceGroups[action.whichPieceGroup].pieceData[
    //     action.whichPiece
    //   ].canvasOffsetY = action.offsetY;
    //   state.pieceGroups[action.whichPieceGroup].pieceData[
    //     action.whichPiece
    //   ].rotation = action.rotation;
    //   console.log(state);
    //   return {
    //     message: action.message,
    //     pieces: state.pieces,
    //     pieceGroups: state.pieceGroups,
    //     selectedPieceID: state.selectedPieceID,
    //     fabrics: state.fabrics,
    //     onDesignWall: state.onDesignWall,
    //     tool: action.tool,
    //     selectedShapes: state.selectedShapes,
    //     errorMessage: state.errorMessage
    //   };
    // case "addSeam":
    //   var newState = Object.assign({}, state);
    //   var newPieceGroupId = Object.keys(state.pieceGroups).length;
    //   newState.pieceGroups[newPieceGroupId] = {};
    //   newState.pieceGroups[newPieceGroupId].idx = newPieceGroupId;
    //   newState.pieceGroups[newPieceGroupId].pieceData = {};
    //   var maxX = 0;
    //   var minX = 100000;
    //   var maxY = 0;
    //   var minY = 100000;
    //   var width = 100;
    //   var height = 100;
    //   action.piecesToMove.forEach((element, idx) => {
    //     var pgIdx = element.pieceGroup;
    //     var pIdx = element.piece;
    //     newState.pieceGroups[newPieceGroupId].pieceData[idx] =
    //       state.pieceGroups[pgIdx].pieceData[pIdx];
    //     newState.onDesignWall[pgIdx] = false;
    //     newState.pieceGroups[newPieceGroupId].maxX =
    //       state.pieceGroups[pgIdx].maxX;
    //     newState.pieceGroups[newPieceGroupId].minX =
    //       state.pieceGroups[pgIdx].minX;
    //     newState.pieceGroups[newPieceGroupId].maxY =
    //       state.pieceGroups[pgIdx].maxY;
    //     newState.pieceGroups[newPieceGroupId].minY =
    //       state.pieceGroups[pgIdx].minY;
    //     newState.pieceGroups[newPieceGroupId].width =
    //       state.pieceGroups[pgIdx].width;
    //     newState.pieceGroups[newPieceGroupId].height =
    //       state.pieceGroups[pgIdx].height;
    //     delete newState.pieceGroups[pgIdx]; //delete whole piece group?
    //   });
    //   newState.onDesignWall[newPieceGroupId] = true;
    //   newState.pieceGroups[newPieceGroupId].onDesignWall = true;

    //   var returnVal = {
    //     message: action.message,
    //     pieces: state.pieces,
    //     pieceGroups: newState.pieceGroups,
    //     selectedPieceID: state.selectedPieceID,
    //     fabrics: state.fabrics,
    //     onDesignWall: state.onDesignWall,
    //     addedSeam: true,
    //     tool: action.tool,
    //     selectedShapes: state.selectedShapes,
    //     errorMessage: state.errorMessage
    //   };
    //   state = Object.assign({}, returnVal);
    //   console.log(state);
    //   return state;
    // case "duplicatePieceGroup":
    //   var newPieceGroupId = Object.keys(state.pieceGroups).length;
    //   var newPieceGroup = Object.assign(
    //     {},
    //     state.pieceGroups[action.whichPieceGroup]
    //   );
    //   newPieceGroup.idx = newPieceGroupId;
    //   state.pieceGroups[newPieceGroupId] = newPieceGroup;
    //   var returnVal = {
    //     message: action.message,
    //     pieces: state.pieces,
    //     pieceGroups: state.pieceGroups,
    //     selectedPieceID: state.selectedPieceID,
    //     fabrics: state.fabrics,
    //     onDesignWall: state.onDesignWall,
    //     addedSeam: true,
    //     tool: action.tool,
    //     selectedShapes: state.selectedShapes,
    //     errorMessage: state.errorMessage
    //   };
    //   state = returnVal;
    //   console.log(state);
    //   return returnVal;
    case "recolorPieceGroup":
      var newState = Object.assign({}, state);
      newState.message = action.message;
      newState.pieceGroups[action.whichPieceGroup].pieceData[
        action.whichPiece
      ].color = action.color;
      newState.pieceGroups[action.whichPieceGroup].isReal = false;
      return newState;
    case "cutPiece":
      console.log(action.replacePiece, action.newPiece);
      var newState = Object.assign({}, state);
      newState.message = action.message;
      //add newPiece
      var newPieceGroupId = Object.keys(state.pieceGroups).length;
      newState.pieceGroups[newPieceGroupId] = {};
      newState.pieceGroups[newPieceGroupId].idx = newPieceGroupId;
      newState.pieceGroups[newPieceGroupId].pieceData = {};
      newState.pieceGroups[newPieceGroupId].pieceData[0] = action.newPiece;
      newState.pieceGroups[newPieceGroupId].onDesignWall = true;
      newState.pieceGroups[newPieceGroupId].isReal = false;
      newState.pieceGroups[newPieceGroupId].width =
        newState.pieceGroups[action.whichPieceGroup].width;
      newState.pieceGroups[newPieceGroupId].height =
        newState.pieceGroups[action.whichPieceGroup].height;
      newState.onDesignWall[newPieceGroupId] = true;
      //replacePiece with half
      newState.pieceGroups[action.whichPieceGroup].pieceData[
        action.whichPiece
      ] = action.replacePiece;
      newState.pieceGroups[action.whichPieceGroup].isReal = false;
      newState.onDesignWall[action.whichPieceGroup] = true;
      return newState;
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
        selectedShapes: state.selectedShapes,
        errorMessage: state.errorMessage
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
