/*
	File concerned with User interactivity (users drawing on canvas)
*/




//init the EventHandlers
document.addEventListener("DOMContentLoaded", function() {
	paper.setup(document.getElementById("canvasMain"));
	document.getElementById("loaderSimulation").style.animationPlayState = "paused";
	putEventHandlerNonInterpolation();
});



//Mediator function to change from interpolated User Drawings to non interpolated ones and vice versa
function changeDrawingMode() {
	eraseTheCurve();

	if (interpolation) {
		document.getElementById("labelMode").innerText = "Mode: Drawing - Non Interpolated";
		putEventHandlerNonInterpolation();
	}
	else {
		document.getElementById("divSeperatorCanvas").style.visibility = "visible";
		document.getElementById("labelMode").innerText = "Mode: Drawing - Interpolated";
		
		putEventHandlerInterpolation();
	}
	interpolation = !interpolation;
}




//sets the right EventHandlers for non interpolated User Drawings
function putEventHandlerNonInterpolation() {
	drawing = false;
	oldMousePos = null;
	mouseEnter = true;
	mouseDown = null;

	//remove the paper.js Event Listener if there are any
	try {
		paper.view.off("mousedown");
		paper.view.off("mousedrag");
		paper.view.off("mouseup");
	} catch (e) {
		console.log("paper.view Eventlistener not ready!");
	}

	canvas2.style.visibility = "hidden";
	path = [];


	// Event-Handler for non interpolated Curve
	canvas.addEventListener("mousedown", mouseDownNonInterpolation);
	canvas.addEventListener("mousemove", mouseMoveNonInterpolation);
	canvas.addEventListener("mouseup", mouseUpNonInterpolation);
}




//callback for Event "mouse Down" (non interpolated Drawing Mode)
function mouseDownNonInterpolation(e) {
	eraseTheCurve();
	drawing = true;
	ctx.beginPath();
	ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
	path.push({x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop});

	if (!mouseEnter) {
		autoCompletePath(path[path.length-2], path[path.length-1]);
		mouseEnter = true;
	}
}

//callback for Event "mouse Move" (non interpolated Drawing Mode)
function mouseMoveNonInterpolation(e) {
	let mousePos = {x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop}
	if (!mouseEnter && mouseDown) { 
		drawing = true;
		autoCompletePath(path[path.length-1], mousePos);
		mouseEnter = false;
	}
	if (!drawing) return;
	path.push(mousePos);
	ctx.lineWidth = 4;
	ctx.lineTo(mousePos.x, mousePos.y);
	ctx.stroke();

	precisePath(path[path.length-2], path[path.length-1], false);
}

//callback for Event "mouse Up" (non interpolated Drawing Mode)
function mouseUpNonInterpolation(e) {
	drawing = false;
	autoCompletePath(path[path.length-1], path[0]);
}




//------------------------------------------------------------------------------------



//sets the right Event-Handlers for interpolated Drawing mode
function putEventHandlerInterpolation() {

	//delete old EventHandlers
	canvas.removeEventListener("mousedown", mouseDownNonInterpolation);
	canvas.removeEventListener("mousemove", mouseMoveNonInterpolation);
	canvas.removeEventListener("mouseup", mouseUpNonInterpolation);

	canvas2.style.visibility = "visible";


	// Event-Handler for Interpolated Curve
	paper.view.onMouseDown = function(event) {
		try {
			path.removeSegments();
			path.remove();
		} catch(err) {}

		eraseTheCurve();
		paper.view.update();
		drawing = true;
		
		path.add(event.point);
	};

	paper.view.onMouseDrag = function(event) {
		if (!drawing) return;
		path.add(event.point);
	};

	paper.view.onMouseUp = function(event) {
		drawing = false;
		path.closed = true;
		if (path.bounds.width < 100 && path.bounds.height < 100) {
			path.scale(5, 5);
		}

		if (path.segments.length > 85) path.simplify(0.9);
		else {
			disAdd = 1;
			inferringRate = 0.0007;
			path.simplify(0.15);
		}

		pathToBezier();

		drawBezierCurvesManually();

	}
}






//put the interpolated path in new arr => so that algorithm is not dependent on paper.js lib!
function pathToBezier() {
	for (let i = 1; i < path.segments.length-1; i++) {
		var segment = path.segments[i];
		var anchorPoint = segment.point;
		var handleIn = segment.handleIn;
		var handleOut = segment.handleOut;

		var nextSegment = path.segments[i + 1];

		var p0 = segment.point;
		var p1 = p0.add(segment.handleOut);
		var p2 = nextSegment.point.add(nextSegment.handleIn.multiply(-1));
		var p3 = nextSegment.point;

		bezierCurves.push([p0, p1, p2, p3]);
	}
	bezierCurves.push([path.segments[path.segments.length-1].point, path.segments[path.segments.length-1].point.add(path.segments[path.segments.length-1].handleOut), path.segments[0].point.add(path.segments[0].handleIn.multiply(-1)), path.segments[0].point]);
}




//if path not cyclic, finish it
function autoCompletePath(start, end) {
	precisePath(start, end, true);

	ctx.moveTo(end.x, end.y);
	ctx.lineTo(start.x, start.y);
	ctx.stroke();
}


//if path not cyclic, finish it (interpolation Mode)
function autoCompleteInterpolation(start, end) {
	let distance = getDistance(start, end);

	let numberPoints = Math.round(distance/7) >= 1 ? Math.round(distance/35) : 1;
	for (let i = 0; i <= numberPoints; i++) {
		let t = i / numberPoints; // Interpolationsfactor
		let x = start.x + t * (end.x - start.x);
		let y = start.y + t * (end.y - start.y);

		path.add(new paper.Point(x, y));
	}
}




// make sure (no matter the mouse speed while drawing) that there are enough Points in the path in non interpolated drawing mode
function precisePath(start, end, autoCompCheck) {
	let distance = getDistance(start, end);

	if (distance > 6 || autoCompCheck) {
		let numberPoints = autoCompCheck ? Math.round(distance/2.3) : Math.round(distance/1.8);
		for (let i = 0; i <= numberPoints; i++) {
			let t = i / numberPoints; // Interpolationsfactor
			let x = start.x + t * (end.x - start.x);
			let y = start.y + t * (end.y - start.y);

			path.push({ x: x, y: y });
		}
	}
}



/*
function updateCanvasSize() {
	let viewportWidth = window.innerWidth;
	let viewportHeight = window.innerHeight;
	let canvasSize = Math.min(viewportWidth, viewportHeight) * 0.6;
	//canvas.width = canvasSize;
	//canvas.height = canvasSize;

	//canvas2.width = canvasSize;
	//canvas2.height = canvasSize;
}
*/




