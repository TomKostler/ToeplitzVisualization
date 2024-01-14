document.addEventListener("DOMContentLoaded", function() {
	var drawing = false;

	if (!interpolation) {
		// Event-Handler for non interpolated Curve
		canvas.addEventListener("mousedown", function(e) {
			drawing = true;
			ctx.beginPath();
			ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
			path.push({ x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop });
			
		});

		canvas.addEventListener("mousemove", function(e) {
			if (!drawing) return;
			ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
			ctx.stroke();
			path.push({ x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop });
			
		});

		canvas.addEventListener("mouseup", function(e) {
			drawing = false;
			autoCompletePath(path[path.length-1], path[0]);
			traverseTheCurveWOI();
		});
	}


	else {
		paper.setup(document.getElementById("canvas"));
		// Event-Handler for Interpolated Curve
		paper.view.onMouseDown = function(event) {
			drawing = true;
			path = new paper.Path();
			path.strokeColor = "black";
			path.strokeWidth = 5;
			path.add(event.point);
		};


		paper.view.onMouseDrag = function(event) {
			if (!drawing) return;
			//path.strokeColor = "white";
			path.add(event.point);
		};

		paper.view.onMouseUp = function(event) {
			drawing = false;
			path.closed = true;
			console.log(path.bounds.width, path.bounds.height);
			if (path.bounds.width < 100 && path.bounds.height < 100) {
				path.scale(5, 5);
			}
			
			console.log(path.segments.length);
			if (path.segments.length > 85) path.simplify(0.9);
			else {
				disAdd = 1;
				inferringRate = 0.0007;
				path.simplify(0.15);
			}

			for (let i = 1; i < path.segments.length-1; i++) {
				var segment = path.segments[i];
				var anchorPoint = segment.point;
				var handleIn = segment.handleIn;
				var handleOut = segment.handleOut;

				var nextSegment = path.segments[i + 1];

			    var p0 = segment.point; // Ankerpunkt des aktuellen Segments
			    var p1 = p0.add(segment.handleOut); // Kontrollpunkt 1
			    var p2 = nextSegment.point.add(nextSegment.handleIn.multiply(-1)); // Kontrollpunkt 2
			    var p3 = nextSegment.point; // Ankerpunkt des nächsten Segments

			    bezierCurves.push([p0, p1, p2, p3]);
			}
			bezierCurves.push([path.segments[path.segments.length-1].point, path.segments[path.segments.length-1].point.add(path.segments[path.segments.length-1].handleOut), path.segments[0].point.add(path.segments[0].handleIn.multiply(-1)), path.segments[0].point]);
			if (!interpolation) autoCompletePath(path.segments[0].point, path.segments[path.segments.length-1].point);


			drawBezierCurvesManually();
			
			//return;

			//traverseTheCurve();
		};
	}


	//if path not cyclic, finish it
	function autoCompletePath(start, end) {

		drawPoint(start, "blue");
		drawPoint(end, "blue");

		for (let i = 0; i <= numberOfPointsAutoComplete; i++) {
			let t = i / numberOfPointsAutoComplete; // Interpolationsfactor
			let x = start.x + t * (end.x - start.x);
			let y = start.y + t * (end.y - start.y);

			path.push({ x: x, y: y });
		}

		ctx.moveTo(end.x, end.y);
		ctx.lineTo(start.x, start.y);
		ctx.stroke();
		
	}
});




