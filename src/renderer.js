/*
First find all the points within render distance
translate points to render space
render
update render functions to take local coordinates
*/
const Direction = require("./direction");
var Point = require("./point");
const Segment = require("./segment");

function Renderer() {
    var self = this;
    self.canvas = null;
    self.context = null;

    self.setCanvas = function(canvas){
        self.canvas = canvas;
        self.context = canvas.getContext("2d");
    };

    self.drawPlayerGrid = function(grid, snakes, apples, playerSnake){      //draws grid and boundaries for player

        var playerGridLength = 40; //some even number; grid has to be odd-symmetrical
        var playerGridHeight = Math.floor((self.canvas.height/self.canvas.width) * playerGridLength) - 1;
        if (playerGridHeight%2 != 0) { //same with the height: if its even, make it odd
            playerGridHeight++;
        }
        var playerSnakeHead = playerSnake.getHead();
        var playerTileLength = self.canvas.width/playerGridLength;

        var moveTime = playerSnake.getMoveTime();
        var timePassed = (Date.now() - moveTime) / grid.getUpdateSpeed();
        console.log(timePassed);

        var testPoint = new Point(5, 5)
        self.drawTileSmooth(playerSnake, timePassed, testPoint, playerTileLength, "pink");

        self.drawLattice(playerTileLength);
        self.drawBorders(playerSnake, timePassed, playerTileLength, playerGridLength, playerGridHeight, grid.getWidth(), grid.getHeight(), playerSnakeHead.getCoordinates());

        var allSnakeSegments = [];                          //deep copy of snake segments for rendering
        for (var i = 0; i < snakes.length; i++) {
            var tempSegments = snakes[i].getSegments();
            for (var h  = 0; h < tempSegments.length; h++) {
                allSnakeSegments.push(tempSegments[h]);
            }
        };
        var camera = new Point(playerGridLength/2, playerGridHeight/2);

        for (var i = 0; i < allSnakeSegments.length; i++) { //drawing the segments 
            var tempSegment = allSnakeSegments[i];
            var segmentCoords = tempSegment.getCoordinates();
            [dx, dy] = self.calcDistance(playerSnakeHead.getCoordinates(), segmentCoords);

            var renderCoordinates = new Point(camera.x - dx, camera.y - dy);
                                                                                                    
            if (Math.abs(dx) < playerGridLength && Math.abs(dy) < playerGridHeight) {               
                self.drawSegment(timePassed, tempSegment, renderCoordinates, playerTileLength, "green");

                /*var previousSegmentCoords = allSnakeSegments[i-1].getCoordinates();
                var nextSegmentCoords = allSnakeSegments[i+1].getCoordinates(); 

                if ((segmentCoords.x - previousSegmentCoords.x == -1 && segmentCoords.y == previousSegmentCoords.y) && 
                (segmentCoords.x - nextSegmentCoords.x == 0 && segmentCoords.y - nextSegmentCoords.y == 1)) {
                    self.drawTileStatic(segmentCoords, playerTileLength, "green");
                }*/
            }
        }

        [dx, dy] = self.calcDistance(playerSnakeHead.getCoordinates(), playerSnakeHead.getCoordinates());
        var renderCoordinates = new Point(camera.x - dx, camera.y - dy);
        self.drawSegment(timePassed, playerSnake.getHead(), renderCoordinates, playerTileLength, "blue");

        for (var i = 0; i < apples.length; i++) {                                                       //for all apples, draws the apples
            var tempApple = apples[i];
            [dx, dy] = self.calcDistance(playerSnakeHead.getCoordinates(), tempApple.getCoordinates())
            var renderCoordinates = new Point(camera.x - dx, camera.y - dy);

            if (Math.abs(dx) < playerGridLength && Math.abs(dy) < playerGridHeight) {
                
                self.drawApple(tempApple, renderCoordinates, playerTileLength);
            }            
        }
    };

    self.drawTileStatic = function(localCoordinates, tileLength, color) {
        self.context.fillStyle = color;
        var xRemainder = self.canvas.width%tileLength;
        var yRemainder = self.canvas.height%tileLength;

        self.context.beginPath();
        self.context.fillRect(localCoordinates.x * tileLength + xRemainder/2, localCoordinates.y * tileLength + yRemainder/2, tileLength, tileLength);
        self.context.stroke();

    }

    self.drawTileSmooth = function(playerSnake, timePassed, localCoordinates, tileLength, color) {
        self.context.fillStyle = color;
        var xRemainder = self.canvas.width%tileLength;
        var yRemainder = self.canvas.height%tileLength;

        if (playerSnake.getHead().getDirection() == Direction.RIGHT) {
            self.context.beginPath();
            self.context.fillRect((localCoordinates.x - timePassed) * tileLength + xRemainder/2, localCoordinates.y * tileLength + yRemainder/2, tileLength, tileLength);
            self.context.stroke();
        }
        else {
            self.context.beginPath();
            self.context.fillRect((localCoordinates.x) * tileLength + xRemainder/2, localCoordinates.y * tileLength + yRemainder/2, tileLength, tileLength);
            self.context.stroke();
        }
    }

    self.drawSegment = function(timePassed, segment, localCoordinates, tileLength){
        var xRemainder = self.canvas.width%tileLength;
        var yRemainder = self.canvas.height%tileLength;
        
        self.context.fillStyle = "green";

        if (segment.getDirection() == Direction.RIGHT) {
            self.context.beginPath();
            self.context.fillRect((localCoordinates.x + timePassed) * tileLength + xRemainder/2, localCoordinates.y * tileLength + yRemainder/2, tileLength, tileLength);
            self.context.stroke();
        }
        if (segment.getDirection() == Direction.LEFT) {
            self.context.beginPath();
            self.context.fillRect((localCoordinates.x + timePassed) * tileLength + xRemainder/2, localCoordinates.y * tileLength + yRemainder/2, tileLength, tileLength);
            self.context.stroke();
        }
        if (segment.getDirection() == Direction.UP) {
            self.context.beginPath();
            self.context.fillRect(localCoordinates.x * tileLength + xRemainder/2, (localCoordinates.y + timePassed) * tileLength + yRemainder/2, tileLength, tileLength);
            self.context.stroke();
        }
        if (segment.getDirection() == Direction.DOWN) {
            self.context.beginPath();
            self.context.fillRect(localCoordinates.x * tileLength + xRemainder/2, (localCoordinates.y - timePassed) * tileLength + yRemainder/2, tileLength, tileLength);
            self.context.stroke();
        }


    };


    self.calcDistance = function(point1, point2) {  //calculating distance used for rendering segments in relation to head
        var dx = (point1.x - point2.x); 
        var dy = (point1.y - point2.y);
        return [dx, dy];
    };

    self.drawBorders = function(playerSnake, timePassed, tileLength, playerLength, playerHeight, gridLength, gridHeight, headCoords) {

        var northBorder = playerHeight/2 - headCoords.y;
        if (northBorder >= 0) {
            for (var i = -1; i < playerLength + 1; i++) {
                for (var h = -1; h < northBorder; h++) {
                    var tempPoint = new Point(i, h);
                    self.drawTileSmooth(playerSnake, timePassed, tempPoint, tileLength, "black");
                }
            }
        }

        var southBorder = playerHeight/2 - (gridHeight - headCoords.y);
        if (southBorder >= 0) {
            for (var i = -1; i < playerLength; i++) {
                for (var h = 0; h < southBorder; h++) {
                    var tempPoint = new Point(i, playerHeight - h);
                    self.drawTileSmooth(playerSnake, timePassed, tempPoint, tileLength, "black");
                }
            }
        }

        var westBorder = playerLength/2 - headCoords.x;
        if (westBorder >= 0) {
            for (var i = 0; i < westBorder; i++) {
                for (var h = -1; h < playerHeight + 1; h++) {
                    var tempPoint = new Point(i, h);
                    self.drawTileSmooth(playerSnake, timePassed, tempPoint, tileLength, "black");
                }
            }
        }

        var eastBorder = playerLength/2 - (gridLength - headCoords.x);
        if (eastBorder >= 0) {
            for (var i = 0; i < eastBorder; i++) {
                for (var h = -1; h < playerHeight + 1; h++) {
                    var tempPoint = new Point(playerLength - i, h);
                    self.drawTileSmooth(playerSnake, timePassed, tempPoint, tileLength, "black");
                }
            }
        }
    }

    self.drawLattice = function(playerTileLength) {

        var xRemainder = self.canvas.width%playerTileLength;
        var yRemainder = self.canvas.height%playerTileLength


        for (var i = 0; i < self.canvas.width/playerTileLength + 1; i++) {        //drawing grid

            var currentX = (i) * playerTileLength + xRemainder/2;
            self.context.moveTo(currentX,0);
            self.context.lineTo(currentX, self.canvas.height);
            self.context.stroke();
        }

        for (var h = 0; h < self.canvas.height/playerTileLength; h++) {
            var currentY = h * playerTileLength + yRemainder/2;
            self.context.moveTo(0,currentY);
            self.context.lineTo(self.canvas.width, currentY);
            self.context.stroke();
        }
    }


    self.drawSnakeHead = function(localCoordinates, tileLength) {
        var xRemainder = self.canvas.width%tileLength;
        var yRemainder = self.canvas.height%tileLength;

        self.context.fillStyle = "green";
        self.context.beginPath();
        self.context.fillRect(localCoordinates.x * tileLength + xRemainder/2 - tileLength, localCoordinates.y * tileLength + yRemainder/2 - tileLength, tileLength, tileLength);

        self.context.fillStyle = "black";

        self.context.beginPath();
        self.context.arc(localCoordinates.x * tileLength + tileLength/4 + xRemainder/2 - tileLength, localCoordinates.y * tileLength + tileLength/4 + yRemainder/2 - tileLength, tileLength * 0.1, 0, 2 * Math.PI);
        self.context.fill();

        self.context.beginPath();
        self.context.arc(localCoordinates.x * tileLength + tileLength/(4/3) + xRemainder/2 - tileLength, localCoordinates.y * tileLength + tileLength/4 + yRemainder/2 - tileLength, tileLength * 0.1, 0, 2 * Math.PI);
        self.context.fill(); 

        self.context.beginPath();
        self.context.arc(localCoordinates.x * tileLength + xRemainder/2 - tileLength/2, localCoordinates.y * tileLength + yRemainder/2 - tileLength/2, tileLength * 0.35, Math.PI, 2 * Math.PI, 1);
        self.context.stroke();
    };

    self.drawSnake = function(snake){
        var snakeSegments = snake.getSegments();
        self.drawSnakeHead(snakeSegments[0]);
        for (var i = 1; i < snakeSegments.length; i++) {
            self.drawSegment(snakeSegments[i]);
        }

    };

    self.drawApple = function(apple, localCoordinates, tileLength) {
        var coords = apple.getCoordinates();
        var xRemainder = self.canvas.width%tileLength;
        var yRemainder = self.canvas.height%tileLength;

        self.context.fillStyle = "red";
        self.context.beginPath();
        self.context.arc(localCoordinates.x * tileLength + xRemainder/2 + tileLength/2, localCoordinates.y * tileLength + yRemainder/2 + tileLength/2, tileLength * 0.45, 0, 2 * Math.PI);
        self.context.fill();
        self.context.stroke();
        
        self.context.fillStyle = "green";
        self.context.beginPath();
        self.context.arc(localCoordinates.x * tileLength + tileLength/2, localCoordinates.y * tileLength + tileLength/1.5, tileLength/4, 0, Math.Pi);
        self.context.fill();
        self.context.stroke();
    };

    self.clear = function() {
        self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
    };

    

    self.cycle = function(grid, snakes, apples, playerSnake) {
        self.clear();
        self.drawPlayerGrid(grid, snakes, apples, playerSnake);
        //self.drawGrid(grid);

        /*for(var i = 0; i < snakes.length; i++){
            self.drawSnake(snakes[i]);
        }

        for(var i = 0; i < apples.length; i++){
            self.drawApple(apples[i]);
        } */
    };
}

module.exports = Renderer;