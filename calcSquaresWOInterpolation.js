
function getDistance(pointA, pointB) {
	return Math.sqrt(
		Math.pow(pointA.x - pointB.x, 2) +
		Math.pow(pointA.y - pointB.y, 2)
	);
}

function calcCandidatesForPointWOI(referencePoint, dis) {
	candidates = [];
	for (let i = 0; i < path.length; i++) {
		if (Math.abs(getDistance(referencePoint, path[i]) - dis) <= offset) {
			candidates.push(path[i]);
		}
	}
	return candidates;
}



function findSquaresWOI(n, candidates, dis) {
	if (n == 4) {
		//visualizePoints(candidates);

		/*counter++;
		if (counter == 1) {
			breakFlag = true;
		}*/


		if (isSquareWOI(candidates, dis)) {
			breakFlag = true;
			console.log(candidates[0], candidates[1], candidates[2], candidates[3]);
			visualizePoints(candidates);
			drawTheSquare(candidates);
			alert("Sqaure found");
		} else {
			return;
		}
	}


	let candidatesLevelN = calcCandidatesForPointWOI(candidates[candidates.length-1], dis);

	for (let i = 0; i < candidatesLevelN.length; i++) {
		candidates.push(candidatesLevelN[i]);
		findSquaresWOI(n+1, candidates, dis);
		candidates.pop();
	}
}




function isSquareWOI(candidates, dis) {
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