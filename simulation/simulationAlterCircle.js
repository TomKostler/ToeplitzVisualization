/*
	File containing the simulation Strategy: Alter Circle
	Starting from an initial circle, several points and the path to them are successively added to the global path
	=> This strategy makes the especially complex => even harder for the algo to find squares
*/


//function that creates the initial circle with a specific resolution (numPoints)
function drawCircle() {
	let numPoints = 200 * Math.pow(complexity, 1.05);

	let radius = Math.random() * maxRadiusStartCircle + 20;
	let xCenter = (10+radius) + Math.random() * ((canvas.width/2-radius) -(10+radius));
	let yCenter = (10+radius) + Math.random() * ((canvas.height/2-radius)-(10+radius));
	let center = new paper.Point(xCenter, yCenter);

	
	for (var i = 0; i <= numPoints; i++) {
		var angle = (i / numPoints) * 2 * Math.PI;
		var x = center.x + radius * Math.cos(angle);
		var y = center.y + radius * Math.sin(angle);

		var point = new paper.Point(x, y);
		path.add(point);
	}
}



/*
	Main Function to alter the global path and make it more complex

	@OPERATION PRINCIPLE:
		the circle is cut open with random start and endpoint and uneven paths to the tipPoint are added
	
	@param  start: startPoint
	@param  tip: tipPoint
	@param  end: endPoint
	@param  insertInd: The index where the new paths should be inserted in
*/
function alterPathToTip(start, tip, end, insertInd) {
	let deviationMax = (Math.random() * 15 + 4) * complexity;

	let numberPoints = start.getDistance(tip)*Math.pow(complexity, 1.3)/(Math.random()*3+1);

	//way to the tip
	for (let i = 0; i <= numberPoints; i++) {
		let t = i / numberPoints; // Interpolationfactor
		let x = start.x + t * (tip.x - start.x);
		let y = start.y + t * (tip.y - start.y);


		//if the found point should be altered
		let ran = Math.floor(Math.random() * (numberPoints-1));
		if (ran > numberPoints/10) {

			//if x or y should be altered => ran > 50% => y 
			let ranDeviation = Math.floor(Math.random() * (deviationMax-1));
			if (ran > numberPoints/2) {
				//y is altered
				y += Math.floor(Math.random() * deviationMax) - deviationMax/2;
			} else {
				//x is altered
				x += Math.floor(Math.random() * deviationMax) - deviationMax/2;
			}
		}

		path.insert(insertInd, new paper.Point(x, y));

	}

	//way from the tip
	for (let i = 0; i <= numberPoints; i++) {
		let t = i / numberPoints; // Interpolationfactor
		let x = tip.x + t * (end.x - tip.x);
		let y = tip.y + t * (end.y - tip.y);


		//if the found point should be altered
		let ran = Math.floor(Math.random() * (numberPoints-1));
		if (ran > numberPoints/10) {

			//if x or y should be altered => ran > 50% => y 
			let ranDeviation = Math.floor(Math.random() * (deviationMax-1));
			if (ran > numberPoints/2) {
				//y is altered
				y += Math.floor(Math.random() * deviationMax) - deviationMax/2;
			} else {
				//x is altered
				x += Math.floor(Math.random() * deviationMax) - deviationMax/2;
			}
		}

		path.insert(insertInd, new paper.Point(x, y));
	}
}






//function that creates tipPoints and evaluates, where to insert them
function createPath() {
	path.selected = true;
	for (let i = 0; i < numberTipPoints; i++) {
		//random Point
		let xTipPoint = 10 + Math.random() * ((canvas.width/2) - 10);
		let yTipPoint = 10 + Math.random() * ((canvas.height/2) - 10);
		var tipPoint = new paper.Point(xTipPoint, yTipPoint);



		//index in path of the closest segment to tip Point
		var indexSegment = path.getNearestLocation(tipPoint).index;


		//number of segments next to the found point on path to remove
		let numRemove = Math.floor(Math.random() * 60 * complexity) + 12;

		let minInd = indexSegment - Math.floor(numRemove/2) < 0 ? path.segments.length - indexSegment - Math.floor(numRemove/2) : indexSegment - Math.floor(numRemove/2);
		let maxInd = (indexSegment + Math.floor(numRemove/2)) % (path.segments.length-1);

		if (maxInd < minInd) {
			let temp = minInd;
			minInd = maxInd;
			maxInd = temp;

			path.removeSegments(maxInd, path.segments.length);
			path.removeSegments(0, minInd);

			alterPathToTip(path.segments[0].point, tipPoint, path.segments[path.segments.length-1].point, 0);
		} else {
			//normal delete pathSegments
			path.removeSegments(minInd, maxInd);
			if (minInd != 0) alterPathToTip(path.segments[minInd].point, tipPoint, path.segments[minInd-1].point, minInd);
			else alterPathToTip(path.segments[minInd].point, tipPoint, path.segments[path.segments.length-1].point, minInd);
		}

		
	}
}




//checks if there are intersections, which leaves the path divided into parts with sufficiently large areas
function checkBigIntersections() {
	if (complexity < 0.4 && path.getIntersections() > 0) return true;

	for (let i = 0; i < path.segments.length; i++) {
		for (let j = i+1; j < path.segments.length; j++) {
			if (path.segments[i].point.getDistance(path.segments[j].point) < (3.5/complexity)) {
				

				//make new Curve 1. part
				let pathPart1 = new paper.Path({
					closed: true
				});
				for (let k = i; k <= j; k++) {
					pathPart1.add(path.segments[k].point);
				}

				//make new Curve 2. part
				let pathPart2 = new paper.Path({
					closed: true
				});
				for (let k = j; k <= path.segments.length+i; k++) {
					pathPart2.add(path.segments[k%path.segments.length].point);
				}


				if (Math.abs(pathPart1.getArea()) > 400 && Math.abs(pathPart2.getArea()) > 400) {
					return true;
				}

				pathPart1.remove();
				pathPart2.remove();

			}
		}
	}
	return false;
}






//DRIVER and callback for simulation-button
function simulationAlterCircle_Start() {
	prepareSimulation();

	path = new paper.Path({
		fillColor: "lightblue",
		strokeColor: "black",
		closed: false
	}); 
	
	drawCircle();
	createPath();


	while (checkBigIntersections()) {
		path.remove();

		path = new paper.Path({
			fillColor: "lightblue",
			strokeColor: "black",
			closed: false
		});

		drawCircle();
		createPath();

		if (complexity < 0.5) path.simplify(1/(complexity*0.9));
		else path.simplify(complexity*12);

		autoCompleteInterpolation(path.segments[1].point, path.segments[path.segments.length-1].point);

	}

	path.closePath();
	if (Math.random() < 0.25) path.simplify();
	
	pathToBezier();
	drawBezierCurvesManually();
	inferringRate = complexity/1.2;
	steps = complexity/1.25;

	document.getElementById("loaderSimulation").style.animationPlayState = "running";
	document.getElementById("loaderSimulation").style.visibility = "visible";

	setTimeout(() => {traverseTheCurve(false)}, 0);
}





