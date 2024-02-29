/*
	Driver File for Driving the Code + Config-Parameters
*/



/*
	-------------------- CONFIG ---------------------------
*/



//---Simulation Mode----

//simulation mode = true, drawing mode = false
var simulationMode = false;
var simulationStrategy = "AlterCircle";

//Simulation TSP
var points = [];


//between 0.2 and 0.95
var complexity = 0.25;

var maxRadiusStartCircle = 150;
var numberTipPoints = (450 * complexity)/4;

var flagSearchAgain = false;



//---Drawing Mode---

//if the curve should be interpolated => if true, number of points on curve "infinite" => higher chance of finding square
var interpolation = false;


var numberOfPointsAutoComplete = 20;

var inferringRate = simulationMode ? complexity/1.2 : 0.075

var inferringRateWOI = 1;


//startPoint Values
var startT = 0.0;
var startSpline = 0;

//offset for distance calculations (e.g. how far "away" a distance is still considered a hit)
var offset = 4;

//offset for degree calculations in function isSquare (how far off an angle is allowed to be)
var offsetDegree = 3;

//how "big" the steps should be when traversing curves
var steps;
if (simulationMode) steps = complexity/1.25;
else steps = 0.065;


//how many steps should be skipped so that it doesn't come to point accumulations because of the offset
var skipSteps = 11;

//the maximum distance a side of a sqaure on the curve is allowed to be
var disMax = canvas.width;
var disAdd = 2;

//the minimum Distance a square is allowed to be
var disStart = 20;


//colors the found Points of the square should be colored with
var colors = ["blue", "red", "green", "yellow"];






/*
	-------------------- IMPORTANT GLOBAL VARS ---------------------------
*/

var path = [];
var bezierCurves = [];

//for ending the recursion in interpolation mode
var breakFlag;

//for drawing the non interpolated Curve
var drawing;
var mouseEnter;
var oldMousePos;
var mouseDown;





/*
	---------------------DRIVER CODE--------------------------------
*/


//Mediator function to decide which Strategy for traversing the curve should be used
function findSquareDriver() {
	if (interpolation) {
		document.getElementById("loaderSimulation").style.animationPlayState = "running";
		document.getElementById("loaderSimulation").style.visibility = "visible";
		setTimeout(() => traverseTheCurve(true), 0);
	} 
	else setTimeout(() => traverseTheCurveWOI(), 0);
}


//Mediator function to decide which Strategy for Simulation should be used
function simulationDriver() {
	if (document.querySelector("input[name='strategy']:checked").value == "AlterCircle") simulationAlterCircle_Start();
	else simulationTSP_Start();
}


//called before Simulation (disables EventHandlers and sets Visibility)
function prepareSimulation() {
	document.getElementById("btnSimulationEnd").style.visibility = "visible";
	canvas2.style.visibility = "visible";
	document.getElementById("labelComplexity").style.visibility = "visible";
	document.getElementById("btnChangeDrawingMode").style.visibility = "hidden";
	document.getElementById("btnEraseCurve").style.visibility = "hidden";
	document.getElementById("btnFindSquares").style.visibility = "hidden";
	document.getElementById("complexitySlider").style.visibility = "visible";
	document.getElementById("labelMode").innerText = "Mode: Simulation";
	document.getElementById("radioBtnForm").style.visibility = "visible";

	interpolation = true;
	eraseTheCurve();

	//remove all Event Handlers
	try {
		canvas.removeEventListener("mousedown", mouseDownNonInterpolation);
		canvas.removeEventListener("mousemove", mouseMoveNonInterpolation);
		canvas.removeEventListener("mouseup", mouseUpNonInterpolation);
	} catch(e) {
		paper.view.off("mousedown");
		paper.view.off("mousedrag");
		paper.view.off("mouseup");
	}
}




//called after Simulation (enables EventHandlers again and sets Visibility)
function simulationEnd() {
	document.getElementById("btnSimulationEnd").style.visibility = "hidden";
	document.getElementById("complexitySlider").style.visibility = "hidden";
	document.getElementById("labelComplexity").style.visibility = "hidden";
	document.getElementById("btnChangeDrawingMode").style.visibility = "visible";
	document.getElementById("btnEraseCurve").style.visibility = "visible";
	document.getElementById("btnFindSquares").style.visibility = "visible";
	document.getElementById("labelMode").innerText = "Mode: Drawing - Non Interpolated";
	document.getElementById("radioBtnForm").style.visibility = "hidden";
	canvas2.visibility = "hidden";
	eraseTheCurve();
	interpolation = false;

	putEventHandlerNonInterpolation();
}


//Event Handler for complexity slider
document.getElementById("complexitySlider").addEventListener("input", () => {
	complexity = document.getElementById("complexitySlider").value/100;
	document.getElementById("labelComplexity").innerText = "Complexity: " + complexity;
});






/*---------------------------------------------------------------------------*/
/*_____________________For Bezier-Spline Interpolation_______________________*/
/*---------------------------------------------------------------------------*/

function traverseTheCurveDistance(P1) {
	for (var d=disStart; d <= disMax; d += disAdd) {
		findSquares(1, [P1], d);
	}
}


/*
	Main Driver Function for finding a square on the curve => calls the algorithm
	checks if there are no self-intersections in drawing mode

	tweaks the steps and inferring parameters if no square was found in 1. round
*/
function traverseTheCurve(boolIntersections) {

	drawBezierCurvesManually();
	console.log("-----------------TraverseTheCurve-------------------------");

	//check if there are self-intersections => otherwise curve is not a Jordan-Curve
	if (boolIntersections && path.getIntersections().length > 0) {
		drawPointWOI(path.getIntersections()[0].point, "red");		
		alert("Intersections in curve!");
		return;
	}



	disMax = getMaxDis();
	console.log("disMax: ", disMax);

	if (disMax == 0) return;

	console.log("Path.length: ", path.length);
	if (path.length < 400) {
		steps = 0.02;
		disAdd = 2;
		offset = 0.5;
	}


	console.log("BezierCurves length: ", bezierCurves.length);
	breakFlag = false;
	for (var spline = 0; spline < bezierCurves.length; spline++) {
		console.log("New Spline");
		for (var t = 0; t <= 1; t += steps) {
			let newCoord = calculateCubicBezierPoint(bezierCurves[spline], t);
			var newP1 = new Point(newCoord.x, newCoord.y, startSpline, startT);
			traverseTheCurveDistance(newP1);
		}
	}


	if (breakFlag != true) {
		if (!flagSearchAgain) {
			alert("No square could be found in first search => tweaking parameters and run again!");
			inferringRate = 0.004;
			steps = 0.03;
			flagSearchAgain = true;
		} else {
			inferringRate -= 0.001;
			steps -= 0.002;
		}
		traverseTheCurve(false);
	}
	flagSearchAgain = false;
}



/*
	Helper function for finding the maximum Distance in an interpolated curve
*/
function getMaxDis() {
	var maxDis = 0;
	for (let t = 0; t <= 1; t += steps) {
		for (let t2 = 0; t2 <= 1; t2 += steps) {
			var pointOnCurveA = path.getPointAt(t * path.length);
			var pointOnCurveB = path.getPointAt(t2 * path.length);
			if (pointOnCurveA == null || pointOnCurveB == null) continue;
			var distance = pointOnCurveA.getDistance(pointOnCurveB);
			if (distance > maxDis) {
				maxDis = distance;
			}
		}			
	}
	return Math.round(maxDis);
}








/*---------------------------------------------------------------------------*/
/*________________________Without Interpolation______________________________*/
/*---------------------------------------------------------------------------*/

function traverseTheCurveDistanceWOI(P1) {
	for (let dis = disStart; dis < disMax; dis++) {
		findSquaresWOI(1, [P1], dis);
	}
}

/*
	Main Driver Function for calling the algorithm for non-interpolated curves (=> curves that consists of a set of points)
*/
function traverseTheCurveWOI() {

	console.log("Path-Length: ", path.length);
	disMax = getMaxDisWOI();
	console.log("disMax: ", disMax);
	for (let i = 0; i < path.length; i++) {
		traverseTheCurveDistanceWOI(path[i]);
	}
	console.log("Finished");
}


/*
	Helper function for finding the maximum Distance in an non-interpolated curve (set of points)
*/
function getMaxDisWOI() {
	let maxDis = 0;
	for (let p1 = 0; p1 < path.length; p1++) {
		for (let p2 = 0; p2 < path.length; p2++) {
			distance = getDistanceWOI(path[p1], path[p2]);
			if (distance > maxDis) {
				maxDis = distance;
			}

			//Make sure the curve doesn't intersect itself => otherwise it's no Jordan-Curve
			if (Math.abs(p2-p1) > 40 && Math.abs(path[p2].x-path[p1].x) < 6 && Math.abs(path[p2].y-path[p1].y) < 6 && Math.abs(p1-p2) < (path.length -25)) {
				drawPointWOI(path[p1], "red");
				drawPointWOI(path[p2], "red");
				alert("Intersections in curve => points mark the intersection");
				return;
			}
		}
	}
	return Math.round(maxDis);
}




	






