var polyk = require("polyk");
const normalize = require("normalize-svg-coords");

// export function scaleBoundaryToCanvas(pieceData, pieceGroup, targetWidth = 100, targetHeight=100) {
//   var boundaryObj = pieceData.boundary;
//   var width = (pieceGroup.maxX - pieceGroup.minX);
//   var height = (pieceGroup.maxY - pieceGroup.minY);
//   var aspectRatio = (1.0 * width) / height;
//   if (aspectRatio > 1.0) {
//     var targetHeight = targetWidth / aspectRatio;
//   } else {
//     var targetWidth = targetHeight * aspectRatio;
//   }
//   var renderedBoundary = {}
//   for (var i = 0; i < Object.keys(boundaryObj).length; ++i) {
//     var point = boundaryObj[i];
//     var px = point.x - pieceGroup.minX;
//     var py = point.y - pieceGroup.minY;
//     var pointx = (px / width) * targetWidth;
//     var pointy = (py / height) * targetHeight;
//     renderedBoundary[i] = {x:pointx, y:pointy}
//   }
//   return renderedBoundary
// }

export function getBBfromClientRect(node) {
  var clientRect = node.getClientRect();
  var absPos = node.absolutePosition();
  var tlx = absPos.x - clientRect.width / 2;
  var tly = absPos.y - clientRect.height / 2;
  var tl = { x: tlx, y: tly };

  var trx = absPos.x + clientRect.width / 2;
  var tryy = absPos.y - clientRect.height / 2;
  var tr = { x: trx, y: tryy };

  var brx = absPos.x + clientRect.width / 2;
  var bry = absPos.y + clientRect.height / 2;
  var br = { x: brx, y: bry };

  var blx = absPos.x - clientRect.width / 2;
  var bly = absPos.y + clientRect.height / 2;
  var bl = { x: blx, y: bly };

  var left = absPos.x - clientRect.width / 2;
  var top = absPos.y - clientRect.height / 2;
  return { tl: tl, tr: tr, br: br, bl: bl, left: left, top: top };
}

export function scaleBoundaryToCanvas(
  pieceData,
  pieceGroup,
  targetWidth = 100,
  targetHeight = 100
) {
  var boundaryObj = pieceData.boundary;
  var width = pieceData.imageWidth;
  var height = pieceData.imageHeight;
  var aspectRatio = (1.0 * width) / height;
  if (aspectRatio > 1.0) {
    var targetHeight = targetWidth / aspectRatio;
  } else {
    var targetWidth = targetHeight * aspectRatio;
  }
  var renderedBoundary = {};
  for (var i = 0; i < Object.keys(boundaryObj).length; ++i) {
    var point = boundaryObj[i];
    var px = point.x;
    var py = point.y;
    var pointx = (px / width) * targetWidth;
    var pointy = (py / height) * targetHeight;
    renderedBoundary[i] = { x: pointx, y: pointy };
  }
  return {
    boundary: renderedBoundary,
    scaleX: targetWidth / width,
    scaleY: targetHeight / height
  };
}

export function scaleBoundaryToOriginal(
  pieceData,
  pieceGroup,
  targetWidth = 100,
  targetHeight = 100
) {
  var boundaryObj = pieceData.boundary;
  var width = pieceGroup.maxX - pieceGroup.minX;
  var height = pieceGroup.maxY - pieceGroup.minY;
  var aspectRatio = (1.0 * width) / height;
  if (aspectRatio > 1.0) {
    var targetHeight = targetWidth / aspectRatio;
  } else {
    var targetWidth = targetHeight * aspectRatio;
  }
  var renderedBoundary = {};
  for (var i = 0; i < Object.keys(boundaryObj).length; ++i) {
    var point = boundaryObj[i];
    var px = point.x - pieceGroup.minX;
    var py = point.y - pieceGroup.minY;
    var pointx = (px / width) * targetWidth;
    var pointy = (py / height) * targetHeight;
    renderedBoundary[i] = { x: pointx, y: pointy };
  }
  return renderedBoundary;
}

export function boundaryToSVG(boundaryCanvasCoordinates) {
  var svgString = "M";
  for (var i = 0; i < Object.keys(boundaryCanvasCoordinates).length; ++i) {
    var point = boundaryCanvasCoordinates[i];
    svgString += point.x.toString() + " " + point.y.toString() + " ";
  }
  return svgString;
}

export function splitShape(
  boundaryPoints,
  lineStart,
  lineEnd,
  xOffset = 0,
  yOffset = 0
) {
  //put coordinates in expected [x0, y0, x1, y1,...] format
  //need coordinates on the canvas
  var allBoundaryPts = [];
  console.log(boundaryPoints);
  for (var i = 0; i < Object.keys(boundaryPoints).length; i++) {
    var point = boundaryPoints[i];
    allBoundaryPts.push(point.x + xOffset);
    allBoundaryPts.push(point.y + yOffset);
  }
  console.log(allBoundaryPts);
  var slices = polyk.Slice(
    allBoundaryPts,
    lineStart.x,
    lineStart.y,
    lineEnd.x,
    lineEnd.y
  );
  console.log(slices);
  var newBoundaryPoints = {};
  for (var i = 0; i < slices.length; i++) {
    var slice = slices[i];
    var boundary = {};
    for (var j = 0; j < slice.length - 1; j += 2) {
      var x = slice[j];
      var y = slice[j + 1];
      //map back to the original image coordinates
      boundary[Object.keys(boundary).length] = {
        x: x - xOffset,
        y: y - yOffset
      };
    }
    newBoundaryPoints[i] = boundary;
  }
  return newBoundaryPoints;
}

export function closestEdgeToPoint(
  boundaryPoints,
  x,
  y,
  xOffset = 0,
  yOffset = 0
) {
  var allBoundaryPts = [];
  for (var i = 0; i < Object.keys(boundaryPoints).length; i++) {
    var point = boundaryPoints[i];
    allBoundaryPts.push(point.x + xOffset);
    allBoundaryPts.push(point.y + yOffset);
  }
  var dist = polyk.ClosestEdge(allBoundaryPts, x, y);
  return dist;
}
