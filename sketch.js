function removeFromArray(arr,elt){
	for(var i=arr.length-1;i>=0;i--){
		if(arr[i] == elt){
			arr.splice(i,1);
		}
	}
}

function heruristic(a,b){
	var d = dist(a.i,a.j,b.i,b.j); // euclidean distance
	//var d = abs(a.i - b.i) + abs(a.j - b.j); //Taxi Cab distance Calculation 
	return d;
}

var cols = 50;
var rows = 50;

var grid = new Array(cols)

var openSet = [];
var closedSet = [];
var start;
var end;

var w;
var h;
var path = [];

function Node(i,j){
	this.f = 0;
	this.g = 0;
	this.h = 0;
	this.i = i;
	this.j = j;	
	this.neighbors = [];
	this.prev;
	this.wall = false;

	if(random(1) < 0.3){// Change to increase more walls
		this.wall = true;
	}

	this.show = function(col) {
		fill(col);
		if(this.wall){
			fill(0);
		}
		noStroke();
		ellipse(this.i * w + w/2,this.j *h + h/2, w/2,h/2);
		//rect(this.i * w,this.j * h, w-1,h-1);
	}
	this.addNeighbors = function() {
		var i=this.i;
		var j=this.j;
		if( i < cols -1) {
			this.neighbors.push(grid[i + 1][j]);
		}
		if(i > 0){
			this.neighbors.push(grid[i - 1][j]);
		}
		if( j < rows -1){
			this.neighbors.push(grid[i][j + 1]);
		}
		if(j > 0){
			this.neighbors.push(grid[i][j - 1]);
		}

		// Diagonals 
		if( i > 0 && j >0){
			this.neighbors.push(grid[i - 1][j - 1]);
		}
		if( i < cols -1 && j > 0){
			this.neighbors.push(grid[i + 1][j - 1]);
		}
		if( i > 0  && j < rows - 1){
			this.neighbors.push(grid[i - 1][j + 1]);
		}
		if( i < cols -1   && j < rows - 1){
			this.neighbors.push(grid[i + 1][j + 1]);
		}
	}
}

function setup() {
	var canvas = createCanvas(600,600);
  	canvas.parent('sketch-holder');
	w = width / cols;
	h = height / rows;

	// Make 2D Array
	for(var i =0;i<cols;i++){
		grid[i] = new Array(rows);
	}	
	
	for(var i =0;i<cols;i++){
		for(var j =0;j<rows;j++){
			grid[i][j] = new Node(i,j);
		}
	}
	for(var i =0;i<cols;i++){
		for(var j =0;j<rows;j++){
			grid[i][j].addNeighbors();
		}
	}
	console.log(grid);
	
	start = grid[0][0];
	end = grid[cols-1][rows-1]

	openSet.push(start);
}

// P5 draw allows for continuous 
// Pseudocode from https://en.wikipedia.org/wiki/A*_search_algorithm
function draw() {
	if(openSet.length > 0) {
		var lowest = 0;
		for(var i=0;i<openSet.length;i++){ // Find Smallest Path aka f = g + h
			if(openSet[i].f < openSet[lowest].f){
				lowest = i;
			}
		}
		var current = openSet[lowest];
		if(current === end){
			noLoop(); // The noLoop() function causes draw() to only execute once
			console.log("Done");
		}
		//Remove From openSet 
		// TODO optimize
		removeFromArray(openSet,current);
		closedSet.push(current);

		var neighbors = current.neighbors;
		for(var i=0;i< neighbors.length;i++){
			var neighbor = neighbors[i];

			if (!closedSet.includes(neighbor) && !neighbor.wall){ // Not in closed set and not wall
				var tentative_gScore = current.g + heruristic(neighbor,current);// Distance is always 1 in this case 
				if(neighbor.g < tentative_gScore){
					tentative_gScore = neighbor.g;	
				}
				if(!openSet.includes(neighbor)){
					openSet.push(neighbor);
				}
				neighbor.prev = current;
				neighbor.g = tentative_gScore;
				neighbor.h = heruristic(neighbor,end);
				neighbor.f = neighbor.h + neighbor.g;
			}
		}
	}// End Of A* 
	else{
		// No solutiion
		return; 
	}

	// Fill Grid 
	//background(255);
	for(var i=0;i< cols; i++){
		for(var j=0;j<rows;j++){
			grid[i][j].show(color(255));
		}
	}			
	for(var i=0;i<closedSet.length;i++){
		closedSet[i].show(color(255,0,0));
	} 
	for(var i=0;i<openSet.length;i++){
		openSet[i].show(color(0,255,0));
	}

	path = [];
	var temp = current;
	path.push(temp)
	while(temp.prev){
		path.push(temp.prev);
		temp = temp.prev;
	}
	/*
	for(var i=0;i<path.length;i++){
		path[i].show(color(0,0,255));
	}
	*/

	beginShape();
	noFill();
	stroke(255,0,255);
	strokeWeight(w/2);
	for(var i=0;i<path.length;i++){
		vertex(path[i].i * w + w/2, path[i].j * h + h/2);
	}
	endShape();
}
