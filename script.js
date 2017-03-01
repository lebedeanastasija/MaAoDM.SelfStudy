var points = [],
	centers = [],
	classes = [],
	maxDistances = [],
	centerDistances = [],
	pointsCount = 15000,
	coordinateCount = 2;

var svg;

var colors = [
	"red",
 	"brown",
 	"blue", 
 	"purple", 
 	"yellow", 
 	"orange", 
 	"gray", 
 	"green", 
 	"crimson", 
 	"lavender", 
 	"indigo", 
 	"moccasin", 
 	"orchid",     
 	"plum", 
 	"silver", 
 	"tan",
 	"red",
 	"brown",
 	"blue", 
 	"purple", 
 	"yellow", 
 	"orange", 
 	"gray", 
 	"green", 
 	"crimson", 
 	"lavender", 
 	"indigo", 
 	"moccasin", 
 	"orchid",     
 	"plum", 
 	"silver", 
 	"tan"
 	];

function onLoad (){

	svgContainer = d3.select("div")
	.append("svg")                   
	.attr("width", 400)
	.attr("height", 400);

	generatePoints(pointsCount);
    generateFirstCenter();

    classes.push(points);
    var maxDistanceInfo = findMaxDistanceInClass(0);
    centers.push(classes[0].splice(maxDistanceInfo.maxIndex, 1)[0]);

    initializeClassSpace();
    dividePointsToClasses();
    drawClasses();
    console.log(centers);
    console.log(points.length);
}


function findNewCenter() {	
	maxDistances = [];

	classes.forEach((pointClass, classIndex) => {
		maxDistances.push(findMaxDistanceInClass(classIndex));
	});

	

	var nextCenterInfo = maxDistances[0];
	maxDistances.forEach((maxDistanceInfo) => {
		if(maxDistanceInfo.maxDistance > nextCenterInfo.maxDistances) {
			nextCenterInfo = maxDistanceInfo;
		}
	});

	var am = findArithmeticMeanBetweenCenters();
	
	if(nextCenterInfo.maxDistance > findArithmeticMeanBetweenCenters()) {
		centers.push(points.splice(nextCenterInfo.maxIndex, 1)[0]);
		console.log(am);
		console.log(nextCenterInfo.maxDistance);
		return true;
	} else {
		return false;
	}
}

function findMaxDistanceInClass(classIndex) {
	var maxDistance = 0,
		maxIndex = 0;
	classes[classIndex].forEach(function(point, pointIndex) {
		if(findDistance(centers[classIndex], point) > maxIndex) {
			maxIndex = pointIndex;
			maxDistance = findDistance(centers[classIndex], point);
		}
	});
	return {
		maxDistance: maxDistance,
		maxIndex: maxIndex
	}
}

function findArithmeticMeanBetweenCenters(){
	if(centers.length > 1) {
		centers.forEach((center, centerIndex) => {
			var tailCenters = centers.slice(centerIndex + 1);
			tailCenters.forEach((tail, tailIndex) => {
				centerDistances.push(findDistance(center, tail));
			});		
		});
		var sum = 0;
		centerDistances.forEach((distanse) => {
			sum += distanse;
		})
		return sum / (centerDistances.length-1) / 2;
	} else {
		return 0;
	}	
}

function dividePointsToClasses(){
	points.forEach(function(point) {		
		var minDistance = 1000,
			ownerClassIndex = 0;
		centers.forEach(function(center, index) {
			if(minDistance > findDistance(point, center)) {
				minDistance = findDistance(point, center);
				ownerClassIndex = index;
			}
		});
		classes[ownerClassIndex].push(point);		
	});
}

function findDistance(point1, point2) {
	return Math.pow((Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2) ), 0.5);
}

function initializeClassSpace(){	
	classes = [];
	for(var i = 0; i < centers.length; i++){
		classes.push([]);
	}
}

function generatePoints(pointsCount) {
	for(var i = 0; i < pointsCount; i++) {
		var vector = [];
		for(var j = 0; j < coordinateCount; j++){
			vector.push(randomInRange(1, 500));
		}
		points.push(vector);
	}
}

function generateFirstCenter() {		
	var firstCenterIndex = randomInRange(0, pointsCount - 1);
	centers.push(points[firstCenterIndex]);
	points.splice(firstCenterIndex,1);
}

function randomInRange(min, max) {
  	return Math.floor(Math.random() * (max - min + 1)) + min;
}


function drawClasses() {
	classes.forEach(function(pointsClass, index) {
		pointsClass.forEach(function(point) {			
			svgContainer.append("circle")
		   .attr("cx", point[0])
		   .attr("cy", point[1])
		   .attr("r", 3)
		   .style("fill", colors[index]);
		});
		svgContainer.append("circle")
		.attr("cx", centers[index][0])
		.attr("cy", centers[index][1])
		.attr("r", 4)
		.style("fill", "black");		
	});
}


function nextDistribution(){
	if(findNewCenter()) {
		initializeClassSpace();
    	dividePointsToClasses();
    	d3.selectAll("circle").remove();
    	drawClasses();
    	console.log(centers);
	} else {
		console.log("The end");
	}		
}

function finishDistribution() {
	while(findNewCenter()) {
    	initializeClassSpace();
    	dividePointsToClasses();
    	d3.selectAll("circle").remove();
    	drawClasses();
    	console.log(centers);
    }
    console.log("The end");
}