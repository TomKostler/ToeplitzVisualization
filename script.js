/*
	Driver File for Driving the Code
*/



/*
	-------------------- CONFIG ---------------------------
*/


//if the curve should be interpolated => if true, number of points infinite => higher chance of finding square
var interpolation = false;

var numberOfPointsAutoComplete = 20;

var inferringRate = 0.055;
var inferringRateWOI = 1;


//startPoint Values
var startT = 0.0;
var startSpline = 0;

//offset for distance calculations (e.g. how far "away" a distance is still considered a hit)
var offset = 3;

//offset for degree calculations in function isSquare (how far off an angle is allowed to be)
var offsetDegree = 2;

//how "big" the steps should be when traversing curves
var steps = 0.05;

//how many steps should be skipped so that it doesn't come to point accumulations because of the offset
var skipSteps = 11;

//the maximum distance a side of a sqaure on the curve is allowed to be
var disMax = 800;
var disAdd = 2;

var disStart = 10;


//colors the found Points of the square should be colored with
var colors = ["blue", "red", "green", "yellow"];




/*
	-------------------- IMPORTANT GLOBAL VARS ---------------------------
*/

var path = [];
var bezierCurves = [];



//Den ganzen Algo besser und schneller machen durch inferring: große Steps wenn dis Momentan weit weg von dis gewünscht ist!



/*
	---------------------DRIVER CODE--------------------------------
*/



/*__________For Bezier-Spline Interpolation_______________________*/


function traverseTheCurveDistance(P1) {
	for (var d=offset; d <= disMax; d += disAdd) {
		findSquares(1, [P1], d);
	}
}

function traverseTheCurve() {
	//drawBezierCurvesManually();

	disMax = getMaxDis();
	console.log("disMax: ", disMax);

	console.log("Path.length: ", path.length);
	if (path.length < 400) {
		steps = 0.02;
		disAdd = 2;
		offset = 0.5;
	}


	console.log(bezierCurves.length);
	for (var spline = 0; spline < bezierCurves.length; spline++) {
		console.log("New Spline");
		//console.log(lookUpCandidates);
		for (var t = 0; t <= 1; t += steps) {
			let newCoord = calculateCubicBezierPoint(bezierCurves[spline], t);
			var newP1 = new Point(newCoord.x, newCoord.y, startSpline, startT);
			traverseTheCurveDistance(newP1);
		}
	}
}





/*____________Without Interpolation______________________________*/
function traverseTheCurveDistanceWOI(P1) {
	for (let dis = disStart; dis < disMax; dis++) {
		findSquaresWOI(1, [P1], dis);
	}
}


function traverseTheCurveWOI() {
	console.log("Path-Length: ", path.length);
	disMax = getMaxDisWOI();
	console.log("disMax: ", disMax);
	for (let i = 0; i < path.length; i++) {
		traverseTheCurveDistanceWOI(path[i]);
	}
	console.log("Finished");
}






function getMaxDis() {
	var maxDis = 0;
	for (let t = 0; t <= 1; t += steps) {
		for (let t2 = 0; t2 <= 1; t2 += steps) {
			var pointOnCurveA = path.getPointAt(t * path.length);
			var pointOnCurveB = path.getPointAt(t2 * path.length);
			var distance = pointOnCurveA.getDistance(pointOnCurveB);
			if (distance > maxDis) {
				maxDis = distance;
			}
		}			
	}
	return Math.round(maxDis);
}

function getMaxDisWOI() {
	var maxDis = 0;
	for (let p1 = 0; p1 < path.length; p1++) {
		for (let p2 = 0; p2 < path.length; p2++) {
			let distance = getDistanceWOI(path[p1], path[p2]);
			if (distance > maxDis) {
				maxDis = distance;
			}
		}			
	}
	return Math.round(maxDis);
}





