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

var cols = 20;
var rows = 20;
var grid = new Array(cols)
var openSet = [];
var closedSet = [];
var start;
var end;
var w;
var h;
var path = [];
var	start = -1; 
var	end = -1;
var pointCount = 2;

function Node(i,j){
	this.f = 0;
	this.g = 0;
	this.h = 0;
	this.i = i;
	this.j = j;	
	this.neighbors = [];
	this.prev;
	this.wall = false;
	this.diameter;
	this.x;
	this.y;
	this.color = color(210);

	if(random(1) < 0.3){// Change to increase more walls
		this.wall = true;
		this.color = color(0);
	}
	
	this.onClicked = function() {
		if(pointCount > 0){
			var d = dist(mouseX,mouseY,this.x,this.y);
			if(d < this.diameter/2){
				if(pointCount == 2 ){
					console.log("Start",this.i,this.j);
					start = grid[this.i][this.j];
					openSet.push(start);
				}
				if(pointCount == 1){
					console.log("Finish",this.i,this.j);
					end = grid[this.i][this.j];
					end.wall = false;
				}
				pointCount--;
			}
		}
	}

	this.show = function(col) {
		fill(this.color);
		noStroke();
		this.x = this.i * w + w/2;
		this.y = this.j *h + h/2;
		this.diameter = w/2;
		this.shape = ellipse(this.x,this.y, this.diameter,this.diameter);
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

function mousePressed() {
	for(var i=0;i< cols; i++){
		for(var j=0;j<rows;j++){
			grid[i][j].onClicked();
		}
	}			
}

function setup() {
	var canvas = createCanvas(800,800);
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
}

// P5 draw allows for continuous 
// Pseudocode from https://en.wikipedia.org/wiki/A*_search_algorithm
// TODO openSet min heap
//
function aStar(){
	if(openSet.length > 0) {
		var lowest = 0;
		for(var i=0;i<openSet.length;i++){ // Find Smallest Path aka f = g + h
			if(openSet[i].f < openSet[lowest].f){
				lowest = i;
			}
		}
		var current = openSet[lowest]; // current = openSet.getMin()
		if(current === end){
			noLoop(); // The noLoop() function causes draw() to only execute once
			console.log("Done");
		}
		//Remove From openSet 
		// TODO optimize
		removeFromArray(openSet,current);
		//
		closedSet.push(current);

		var neighbors = current.neighbors;
		for(var i=0;i< neighbors.length;i++){
			var neighbor = neighbors[i];

			if (!closedSet.includes(neighbor) && !neighbor.wall){ // Not in closed set and not wall
				var tentative_gScore = current.g + heruristic(neighbor,current);// Distance is always 1 in this case 
				if(!openSet.includes(neighbor)){
					openSet.push(neighbor);
				}
				if(neighbor.g < tentative_gScore){
					tentative_gScore = neighbor.g;		
				}

				neighbor.prev = current;
				neighbor.g = tentative_gScore;
				neighbor.h = heruristic(neighbor,end);
				neighbor.f = neighbor.h + neighbor.g;
			}
		}
		return current;
	}// End Of A* 
	else{
		// No Solution  
		console.log("No Solution");
		noLoop();
	}

}
function draw() {
	var current;
	// A Star Algorithm
	if(start != -1 && end != -1){
		current = aStar();
	}
	// Set Closed Set To Red
	for(var i=0;i<closedSet.length;i++){
		closedSet[i].color = color(255,0,0);
	} 
	// Set Open Set Color to Green
	for(var i=0;i<openSet.length;i++){
		openSet[i].color = color(0,255,0);
	}
	// Show Grid
	for(var i=0;i< cols; i++){
		for(var j=0;j<rows;j++){
			grid[i][j].show();
		}
	}		
	// Draw Path
	if(typeof current != 'undefined'){
		path = [];
		var temp = current;
		path.push(temp)
		while(temp.prev){
			path.push(temp.prev);
			temp = temp.prev;
		}
		beginShape();
		noFill();
		stroke(255,0,255);
		strokeWeight(w/2);
		for(var i=0;i<path.length;i++){
			vertex(path[i].i * w + w/2, path[i].j * h + h/2);
		}
		endShape();
	}
}

