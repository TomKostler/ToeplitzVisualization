/*
	File with util functions for drawing on the canvas'
*/



var canvas = document.getElementById("canvasMain");
var ctx = canvas.getContext("2d");
var canvas2 = document.getElementById("canvas2");
var ctx2 = canvas2.getContext("2d");




//helper-function to visualize the bezierCurves on the 2nd Canvas
function drawBezierCurvesManually() {
	for (let i = 0; i < bezierCurves.length; i++) {
		ctx2.beginPath();
		ctx2.moveTo(bezierCurves[i][0].x, bezierCurves[i][0].y);
		ctx2.bezierCurveTo(bezierCurves[i][1].x, bezierCurves[i][1].y, bezierCurves[i][2].x, bezierCurves[i][2].y, bezierCurves[i][3].x, bezierCurves[i][3].y);
		ctx2.strokeStyle = "red";
		ctx2.stroke();
		ctx2.closePath();
	}
}


//function to clean the canvases, set the new paths and prepare for new found Rounds of Finding Squares
function eraseTheCurve() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
	paper.project.activeLayer.removeChildren();
	if (interpolation) {
		try {
			path.removeSegments();
			path.remove();
		} catch (err) {}
		path = new paper.Path();
		path.strokeColor = "black";
		path.strokeWidth = 5;
		paper.view.update();
	} else {
		path = [];
	}
	bezierCurves = [];
	mouseEnter = true;
	breakFlag = false;
	ctx.strokeStyle = "black";
}




//draws a given point on the canvas (regulary, without paper.js)
function drawPointWOI(point, color) {
	ctx.beginPath();
	ctx.strokeColor = "black";
	ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
}

//draws a given point on the canvas (with paper.js)
function drawPoint(point, color) {
	var pointOff = new Point(point.x, point.y);

	var point = new paper.Path.Circle({
		center: path.getNearestPoint(pointOff),
		radius: 8, 
		fillColor: color
	});
}




//draws the 4 found points on the canvas
function visualizePoints(candidates) {
	for (let i = 0; i < candidates.length; i++) {
		if (interpolation) drawPoint(candidates[i], colors[i]);
		else drawPointWOI(candidates[i], colors[i]);
	}
}



//visualizes the sqaure on the given canvas
function drawTheSquare(candidates, context) {
	context.beginPath();
	context.moveTo(candidates[0].x, candidates[0].y);
	context.strokeStyle = "blue";

	for (let i = 1; i < candidates.length; i++) {
		context.lineTo(candidates[i].x, candidates[i].y);
	}
	context.closePath();
	context.stroke();
}


//visualizes the sqaure on the given canvas in interpolation mode
function drawTheSquareInterpolation(candidates, context) {
	let pointA;
	let pointB;
	let pathLine;
	for (let i = 0; i < candidates.length-1; i++) {
		pointA = new paper.Point(path.getNearestPoint(candidates[i]));
		pointB = new paper.Point(path.getNearestPoint(candidates[i+1]));

		pathLine = new paper.Path.Line(pointA, pointB);
		pathLine.strokeColor = "blue";
		pathLine.strokeWidth = 4;
	}

	pointA = new paper.Point(path.getNearestPoint(candidates[3]));
	pointB = new paper.Point(path.getNearestPoint(candidates[0]));
	pathLine = new paper.Path.Line(pointA, pointB);
	pathLine.strokeColor = "blue";
	pathLine.strokeWidth = 4;
}





