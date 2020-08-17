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
  fullHistory: {},
  pieceHistory: {},
  history: []
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
        fullHistory: {},
        pieceHistory: {},
        history: []
      };
    case "loadSavedState":
      return action.savedState;
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

      if (action.display) {
        newCommandHistory[commandId] = {
          command: action.command,
          storedPieceGroups: JSON.parse(JSON.stringify(state.pieceGroups)),
          affectedPieceGroups: [...state.selectedShapes]
        };
      }
      newFullHistory[fhId] = {
        command: action.command,
        storedPieceGroups: JSON.parse(JSON.stringify(state.pieceGroups)),
        affectedPieceGroups: [...state.selectedShapes]
      };
      state.commandHistory = newCommandHistory;
      state.fullHistory = newFullHistory;
      if (Object.keys(action).indexOf("stageBefore") > -1) {
        state.history[state.history.length - 1].stageBefore =
          action.stageBefore;
      }
      if (Object.keys(action).indexOf("stageAfter") > -1) {
        state.history[state.history.length - 1].stageAfter = action.stageAfter;
      }
      console.log("adding command", state.commandHistory);
      state.selectedShapes = [];
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
      state.message = action.message;
      state.errorMessage = action.errorMessage;
      return state;
    case "deletePieceGroups":
      state.message = action.message;
      action.whichPieceGroups.forEach((pgId, i) => {
        state.selectedShapes = state.selectedShapes.filter((e) => e !== pgId);
        delete state.pieceGroups[pgId];
      });
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
        newPieceGroup.x = newPieceGroup.x + action.offsets[pgId];
        state.pieceGroups[newPieceGroupId] = newPieceGroup;
        state.pieceGroups[newPieceGroupId].idx = newPieceGroupId;
        state.onDesignWall[newPieceGroupId] = true;
        state.pieceGroups[newPieceGroupId].onDesignWall = true;
        state.pieceGroups[newPieceGroupId].isReal = false;
        newPgs.push(newPieceGroupId);
        state.history.push({
          action: "duplicate",
          parents: [pgId],
          children: [pgId, newPieceGroupId]
        });
      });
      var newSelectedShapes = [...state.selectedShapes];
      newPgs.forEach((pg) => {
        newSelectedShapes.push(pg);
      });
      state.selectedShapes = newSelectedShapes;
      state.message = action.message;
      console.log("IN DUPL", state.selectedShapes);
      console.log(state.history);
      return state;
    case "sewPieces":
      state.message = action.message;
      var newState = JSON.parse(JSON.stringify(state));
      var oldPg = [];
      var history = {
        action: "sew",
        parents: [],
        children: []
      };
      action.changes.forEach((change, idx) => {
        var pieceData = JSON.parse(
          JSON.stringify(state.pieceGroups[change.oldPg].pieceData[change.oldP])
        );
        history.parents.push(change.oldPg);
        history.parents.push(change.newPg);
        history.children.push(change.newPg);

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
      newState.history.push(history);
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
        state.pieceHistory[idx] = [];
        state.history.push({
          action: "cut",
          parents: [null],
          children: [idx]
        });
        if (Object.keys(state.pieceGroups[idx].pieceData).length > 1) {
          state.history.push({
            action: "sew",
            parents: [null],
            children: [idx]
          });
        }
        // Object.keys(state.pieceGroups[idx].pieceData).forEach((pid, j) => {
        //   state.pieceHistory[idx].push({
        //     action: "cut",
        //     pieceGroups: [idx],
        //     pieces: [pid]
        //   });
        // });
        // if (Object.keys(state.pieceGroups[idx].pieceData).length > 1) {
        //   state.pieceHistory[idx].push({
        //     action: "sew",
        //     pieceGroups: [idx],
        //     pieces: Object.keys(state.pieceGroups[idx].pieceData)
        //   });
        // }
        idx += 1;
      }
      console.log("init state", state);
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
    case "recolorPieceGroup":
      var newState = Object.assign({}, state);
      newState.message = action.message;
      newState.pieceGroups[action.whichPieceGroup].pieceData[
        action.whichPiece
      ].color = action.color;
      newState.pieceGroups[action.whichPieceGroup].isReal = false;
      newState.history.push({
        action: "recolor",
        parents: [action.whichPieceGroup],
        children: [action.whichPieceGroup],
        stageBefore: action.stageBefore,
        stageAfter: action.stageAfter
      });
      return newState;
    case "cutPiece":
      console.log(action.replacePiece, action.newPiece);
      var newState = Object.assign({}, state);
      newState.message = action.message;
      //add newPiece
      var newPieceGroupId = Object.keys(state.pieceGroups).length;
      newState.pieceGroups[newPieceGroupId] = {};
      newState.pieceGroups[newPieceGroupId].idx = newPieceGroupId;
      newState.pieceGroups[newPieceGroupId].x =
        newState.pieceGroups[action.whichPieceGroup].x + 5;
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
      newState.history.push({
        action: "cut",
        parents: [action.whichPieceGroup],
        children: [action.whichPieceGroup, newPieceGroupId]
      });
      // state.pieceHistory[action.whichPieceGroup].push({
      //   action: "cut",
      //   pieceGroups: [action.whichPieceGroup, newPieceGroupId],
      //   pieces: [0]
      // });
      // state.pieceHistory[newPieceGroupId].push({
      //   action: "cut",
      //   pieceGroups: [action.whichPieceGroup, newPieceGroupId],
      //   pieces: [0]
      // });

      console.log("in cut state is ", newState);
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
