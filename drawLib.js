/*
	File for everything drawing/canvas related
*/



const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const ctx2 = document.getElementById("canvas2").getContext("2d");


/*
//For the circle
var centerX = 200;
var centerY = 200;
var radius = 100;
const controlPoint = 4 * (Math.sqrt(2) - 1) / 3 * radius;

function drawCircleWithTwoCurves() {

	ctx.beginPath();

	// Erste Bezier-Kurve (obere Hälfte des Kreises)
	ctx.moveTo(centerX + radius, centerY);
	ctx.bezierCurveTo(centerX + radius, centerY - controlPoint, centerX + controlPoint, centerY - radius, centerX, centerY - radius);
	ctx.bezierCurveTo(centerX - controlPoint, centerY - radius, centerX - radius, centerY - controlPoint, centerX - radius, centerY);
	ctx.bezierCurveTo(centerX - radius, centerY + controlPoint, centerX - controlPoint, centerY + radius, centerX, centerY + radius);
	ctx.bezierCurveTo(centerX + controlPoint, centerY + radius, centerX + radius, centerY + controlPoint, centerX + radius, centerY);


	// Stil und Zeichnen
	ctx.strokeStyle = 'blue';
	ctx.stroke();
	ctx.closePath();
}


//drawCircleWithTwoCurves();




// Define the points as {x, y}
let start = { x: 50, y: 20 };
let cp1 = { x: 430, y: 30 };
let cp2 = { x: 600, y: 80 };
let end = { x: 250, y: 100 };


let cp3 = { x: 50, y: 90 };
let cp4 = { x: 10, y: 10 };



function drawNormalCurve() {
	//Draw the curve
	ctx.beginPath();
	ctx.moveTo(start.x, start.y);
	ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
	ctx.stroke();


	ctx.beginPath();
	ctx.moveTo(end.x, end.y);
	ctx.bezierCurveTo(cp3.x, cp3.y, cp4.x, cp4.y, start.x, start.y);
	ctx.stroke();	
}

//drawNormalCurve();

*/




function drawBezierCurvesManually() {
	for (let i = 0; i < bezierCurves.length; i++) {
		ctx2.beginPath();
		ctx2.moveTo(bezierCurves[i][0].x, bezierCurves[i][0].y);
		ctx2.bezierCurveTo(bezierCurves[i][1].x, bezierCurves[i][1].y, bezierCurves[i][2].x, bezierCurves[i][2].y, bezierCurves[i][3].x, bezierCurves[i][3].y);
		ctx2.strokeStyle = "red";
		ctx2.stroke();
		ctx2.closePath();


		/*ctx2.beginPath();
		ctx2.strokeColor = "black";
		ctx2.arc(bezierCurves[i][0].x, bezierCurves[i][0].y, 5, 0, 2 * Math.PI);
		ctx2.fillStyle = "blue";
		ctx2.fill();
		ct2.closePath();*/

	}
}





/*
	draws a given point on the canvas

	@params: 
		point: Point-Object
		color 
*/
function drawPointWOI(point, color) {
	ctx.beginPath();
	ctx.strokeColor = "black";
	ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
}


function drawPoint(point, color) {
	var pointOff = new Point(point.x, point.y);

	var point = new paper.Path.Circle({
	    center: path.getNearestPoint(pointOff),
	    radius: 8, 
	    fillColor: color
	});
}



/*
	draws the 4 found points on the canvas

	@param: candidates  stores the 4 points as point-objects
*/
function visualizePoints(candidates) {
	for (let i = 0; i < candidates.length; i++) {
		if (interpolation) drawPoint(candidates[i], colors[i]);
		else drawPointWOI(candidates[i], colors[i]);
	}
}




function drawTheSquare(candidates, context) {

	console.log("Candidates: ", candidates);

	context.beginPath();
	context.moveTo(candidates[0].x, candidates[0].y);

	for (let i = 1; i < candidates.length; i++) {
		context.lineTo(candidates[i].x, candidates[i].y);
	}
	context.closePath();
	context.stroke();
}





