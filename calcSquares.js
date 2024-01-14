/*
	- File for calculating Points on BezierCurves via Parametrisation
	- File for checking if a sqaure with a given sidelength and P1 P1 is on the curves
*/


var breakFlag = false;
var counter = 0;





/*
	class that holds all important information about a point 

	@param x: x coordinate
	@param y: y coordinate
	@param splinePart: which splinePart of the original full Curve the point is in (=> index of the array "bezierCurves")
	@param t: parametrisation of the point (0 <= t <= 1)

*/
class Point {
	constructor(x, y, splinePart, parametrisation) {
		this.x = x;
		this.y = y;
		this.splinePart = splinePart;
		this.t = parametrisation;
	}
}




/*
	function that calculates the candidates (points a specific dis away from reference point)

	@OPERATION PRINCIPLE:
		For every BezierSpline check if there's a point on the spline that has the euclidean distance dis from the reference point.
	
	@param  referencePoint: point-object the new points should be distance dis away
	@param  dis: euclidean distance of the vertices of the square

	@return points: an array consisiting of all the found point-objects with distance dis to the reference point

*/

function calcCandidatesForPoint(referencePoint, dis, bezierCurves) {

	let bezierPoint, distance;
	let flagCounter = 0;
	var points = [];

	let stepsCandidates = steps;
	let distanceOld = 0;
	let counter = 0;

	for (let c = referencePoint.splinePart; c < referencePoint.splinePart + bezierCurves.length; c++) {
		for (let t = c == referencePoint.splinePart ? referencePoint.t : 0; t <= 1; t += stepsCandidates) {

			//calc cycle correct
			if (c >= bezierCurves.length && c%bezierCurves.length == referencePoint.splinePart && t >= referencePoint.t-offset) break;


			if (flagCounter > 0) {
				//after a point was found make sure that the next point is a specific distance away from the found one => otherwise accumulation bc of offset
				flagCounter++;
				if (flagCounter > skipSteps) flagCounter = 0;
			} else {
				//calculate Bézier point
				bezierPoint = calculateCubicBezierPoint(bezierCurves[c%bezierCurves.length], t);

				//get distance from found bezierPoint at t back to starting Point
				let distance = getDistance(bezierPoint, referencePoint);

				if (distance <= dis+offset && distance >= dis-offset) {
					flagCounter++;
					points.push(new Point(bezierPoint.x, bezierPoint.y, c%bezierCurves.length, t));
				}

				
				//inferring
				if ((distance - dis) > (distanceOld - dis) && stepsCandidates <= 0.35) {
					stepsCandidates += inferringRate;
				} else {
					if ((distance > dis) && (stepsCandidates-inferringRate) >= steps) {
						//console.log(stepsCandidates, steps);
						counter++;
						stepsCandidates -= inferringRate;
					}
				}
				

				distanceOld = distance;
			}
		}

	}
	//console.log("counter= " + counter);
	return points;
}




function calculateCubicBezierPoint(points, t) {
	const [p0, p1, p2, p3] = points;
	const x = (1 - t) ** 3 * p0.x + 3 * (1 - t) ** 2 * t * p1.x + 3 * (1 - t) * t ** 2 * p2.x + t ** 3 * p3.x;
	const y = (1 - t) ** 3 * p0.y + 3 * (1 - t) ** 2 * t * p1.y + 3 * (1 - t) * t ** 2 * p2.y + t ** 3 * p3.y;
	return { x, y };
}




function getDistance(pointA, pointB) {
	return Math.sqrt(
		Math.pow(pointA.x - pointB.x, 2) +
		Math.pow(pointA.y - pointB.y, 2)
	);
}



/*
	recursive function with backtracking that calculates points for P2, P3 and P4

	@param  n: index of point
	@param  candidates: array of the candidates to consider
	@param  dis: distance candidates should be apart

*/
function findSquares(n, candidates, dis) {

	if (breakFlag == true) return;

	if (n == 4) {
		document.getElementById("canvas").getContext("2d").clearRect(0, 0, 1000, 1000);

		/*counter++;
		if (counter == 1) {
			breakFlag = true;
		}*/


		if (isSquare(candidates, dis)) {
			//drawBezierCurvesManually();
			drawTheSquareWOI(candidates, dis);
			//visualizePoints(candidates);
			path.strokeColor = "white";
			drawBezierCurvesManually();
			path.strokeColor = "black";
			breakFlag = true;
			console.log(candidates[0], candidates[1], candidates[2], candidates[3]);
			alert("Sqaure found");
			//return;
		} else {
			return;
		}
	}


	let candidatesLevelN = calcCandidatesForPoint(candidates[candidates.length-1], dis, bezierCurves);



	for (let i = 0; i < candidatesLevelN.length; i++) {
		candidates.push(candidatesLevelN[i]);
		findSquares(n+1, candidates, dis);
		candidates.pop();
	}
}





/*
	function that checks if the 4 points in candidates-Array form the vertices of a square by checking if the 4 sidelength are equal and checking 2 Angles = 90 degree with an additional offsetDegree

	@param  candidates: Array of the 4 points that should be considered
	@param  dis: the distance the points should be away from each other

	@return bool, if a sqaure with the points was found
*/
function isSquare(candidates, dis) {

	//vectors
	let vectorP1P4 = [candidates[3].x - candidates[0].x, candidates[3].y - candidates[0].y];
	let vectorP1P2 = [candidates[1].x - candidates[0].x, candidates[1].y - candidates[0].y];

	let vectorP3P4 = [candidates[3].x - candidates[2].x, candidates[3].y - candidates[2].y];
	let vectorP3P2 = [candidates[1].x - candidates[2].x, candidates[1].y - candidates[2].y];

	let vectorP2P1 = [candidates[0].x - candidates[1].x, candidates[0].y - candidates[1].y];
	let vectorP2P3 = [candidates[2].x - candidates[1].x, candidates[2].y - candidates[1].y];

	//with scalar vector product
	var scalarProdAlpha = vectorP1P4[0]*vectorP1P2[0] + vectorP1P4[1]*vectorP1P2[1];
	var scalarProdBeta = vectorP3P4[0]*vectorP3P2[0] + vectorP3P4[1]*vectorP3P2[1];
	var scalarProdGamma = vectorP2P3[0]*vectorP2P1[0] + vectorP2P3[1]*vectorP2P1[1];



	let disP1P2 = getDistance(candidates[0], candidates[1]);
	let disP2P3 = getDistance(candidates[1], candidates[2]);
	let disP3P4 = getDistance(candidates[2], candidates[3]);
	let disP4P1 = getDistance(candidates[3], candidates[0]);



	let angleDegreeAlpha = Math.acos(scalarProdAlpha / (disP1P2 * disP4P1)) * (180 / Math.PI);
	let angleDegreeBeta = Math.acos(scalarProdBeta / (disP3P4 * disP2P3)) * (180 / Math.PI);
	let angleDegreeGamma = Math.acos(scalarProdGamma / (disP2P3 * disP1P2))  * (180 / Math.PI);
	//console.log("Angle: " , angleDegreeAlpha, angleDegreeBeta, angleDegreeGamma);




	if (Math.abs(disP1P2 - dis) < offset && Math.abs(disP2P3 - dis) < offset && Math.abs(disP3P4 - dis) < offset && Math.abs(disP4P1 - dis) < offset) {
		if (Math.abs(angleDegreeAlpha - 90) <= offsetDegree && Math.abs(angleDegreeBeta - 90) <= offsetDegree && Math.abs(angleDegreeGamma - 90) <= offsetDegree) {
			return true;
		}
	}

	return false;
}







