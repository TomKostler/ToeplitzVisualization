/*
	File containing the simulation Strategy: TSP
	random points on the canvas are created and 
*/


//creates the random points
function createPoints() {
	for (let i = 0; i < Math.pow(complexity, 3)/2 * 650; i++) {
		points.push(new paper.Point(Math.floor(Math.random() * (canvas.width/2 - 20)) + 10, Math.floor(Math.random() * (canvas.height/2 - 20)) + 10));
	}
}



//calculates distance matrix => makes it easier for TSP-ALGO
function getDisMatrix() {
	//prepare Matrix
	let matrix = new Array(points.length);
    for (let i = 0; i < points.length; i++) {
        matrix[i] = new Array(points.length);
    }


	for (let i = 0; i < points.length; i++) {
		for (let j = i; j < points.length; j++) {
			matrix[i][j] = points[i].getDistance(points[j]);
			matrix[j][i] = matrix[i][j];
		}
	}
	return matrix;
}



//Heuristic for TSP that finds a near optimum tour (order of the random points) in O(n^2) and also minimizes intersections
function nearestInsertionTSP() {
	var tour = [];

	//init visited
	var visited = new Array(points.length).fill(false);

	//put first node in the tour
	tour.push(points[0]);
	visited[0] = true;
	tour.push(points[0]);



	while (tour.length < points.length) {
		//select the point with min dis to the tour
		let disMin = Number.MAX_VALUE;
		let closestPointToTour = null;
		let indClosestPoint = null;
		let pointInTour = null;
		for (let i = 0; i < tour.length; i++) {
			for (let j = 0; j < points.length; j++) {
				if (visited[j] == false) {
					let disCurrent = tour[i].getDistance(points[j]);
					if (disCurrent <= disMin) {
						disMin = disCurrent;
						closestPointToTour = points[j];
						pointInTour = tour[i];
						indClosestPoint = j;
					}
				}
			}
		}


		//update visited
		visited[indClosestPoint] = true;

		//insert new found Point into right spot in cycle
		let minDisNewSegment = Number.MAX_VALUE;
		let indInsert = null;
		for (let i = 0; i < tour.length-1; i++) {
			let minDisCurrentSegment = tour[i].getDistance(closestPointToTour) + closestPointToTour.getDistance(tour[i+1]) - tour[i].getDistance(tour[i+1]);
			if (minDisCurrentSegment < minDisNewSegment) {
				minDisNewSegment = minDisCurrentSegment;
				indInsert = i;
			}
		}
		tour.splice(indInsert + 1, 0 , closestPointToTour);
	}	
	return tour;
}


//DRIVER and callback for simulation-button
function simulationTSP_Start() {
	prepareSimulation();

	
	createPoints();
	var distanceMatrix = getDisMatrix();
	var tour = nearestInsertionTSP(distanceMatrix);
	console.log("Optimal tour:", tour);



	path = new paper.Path({
			fillColor: "lightblue",
			strokeColor: "black",
	});


	path.addSegments(tour);

	autoCompleteInterpolation(path.firstSegment.point, path.segments[1].point);

	points = [];
	path.closePath();

	if (Math.random() < 0.3 && complexity > 0.35) path.simplify();
	else path.flatten();


	pathToBezier();
	drawBezierCurvesManually();
	inferringRate = complexity/12;
	steps = complexity/10;

	document.getElementById("loaderSimulation").style.animationPlayState = "running";
	document.getElementById("loaderSimulation").style.visibility = "visible";

	setTimeout(() => {traverseTheCurve(false)}, 0);
}







