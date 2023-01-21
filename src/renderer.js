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

        var playerGridLength = 30; //some even number; grid has to be odd-symmetrical
        var playerGridHeight = Math.floor((self.canvas.height/self.canvas.width) * playerGridLength) - 1;
        if (playerGridHeight%2 != 0) { //same with the height: if its even, make it odd
            playerGridHeight++;
        }
        var playerSnakeHead = playerSnake.getHead();
        var playerTileLength = self.canvas.width/playerGridLength;

        //var timePassed = (Date.now() - grid.getLastUpdate()) / grid.getUpdateSpeed()
        var timePassed = 0;
        //console.log('elated time: %f', timePassed);


        self.drawLattice(playerTileLength);
        self.drawBorders(playerSnake, timePassed, playerTileLength, playerGridLength, playerGridHeight, grid.getWidth(), grid.getHeight(), playerSnakeHead.getCoordinates());
        console.log("Score: %d", playerSnake.getScore());
        
        var camera = new Point(playerGridLength/2, playerGridHeight/2);

        for (var i = 0; i < snakes.length; i++) {
            var snakeSegments = snakes[i].getSegments();
            for (var j = 0; j < snakeSegments.length; j++) {
                var tempSegment = snakeSegments[j];
                var tempCoordinates = tempSegment.getCoordinates();
                [dx, dy] = self.calcDistance(playerSnakeHead.getCoordinates(), tempCoordinates);

                var renderCoordinates = new Point(camera.x - dx, camera.y - dy);
                if (Math.abs(dx) < playerGridLength && Math.abs(dy) < playerGridHeight) {              
                    if (j == 0) {
                       self.drawSnakeHead(renderCoordinates, playerTileLength);
                    }
                    else {
                        self.drawSegment(timePassed, tempSegment, renderCoordinates, playerTileLength, "green");
                    }
                }
            }
        }

        [dx, dy] = self.calcDistance(playerSnakeHead.getCoordinates(), playerSnakeHead.getCoordinates());
        var renderCoordinates = new Point(camera.x - dx, camera.y - dy);

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

        self.context.beginPath();

        if (playerSnake.getHead().getDirection() == Direction.RIGHT) {    
            self.context.fillRect((localCoordinates.x - timePassed) * tileLength + xRemainder/2, localCoordinates.y * tileLength + yRemainder/2, tileLength, tileLength);
        }
        else if (playerSnake.getHead().getDirection() == Direction.LEFT) {
            self.context.fillRect((localCoordinates.x + timePassed) * tileLength + xRemainder/2, localCoordinates.y * tileLength + yRemainder/2, tileLength, tileLength);

        }
        else if (playerSnake.getHead().getDirection() == Direction.UP) {
            self.context.fillRect((localCoordinates.x) * tileLength + xRemainder/2, (localCoordinates.y + timePassed) * tileLength + yRemainder/2, tileLength, tileLength);
        }
        else {
            self.context.fillRect((localCoordinates.x) * tileLength + xRemainder/2, (localCoordinates.y - timePassed) * tileLength + yRemainder/2, tileLength, tileLength);
        }
        self.context.stroke();
    }

    self.drawSegment = function(timePassed, segment, localCoordinates, tileLength){
        var xRemainder = self.canvas.width%tileLength/2;
        var yRemainder = self.canvas.height%tileLength/2;
        
        self.context.fillStyle = "green";
        self.context.beginPath();

        self.context.fillRect((localCoordinates.x) * tileLength + xRemainder, localCoordinates.y * tileLength + yRemainder, tileLength, tileLength);

        /*if (segment.getDirection() == Direction.RIGHT) {
            self.context.fillRect((localCoordinates.x) * tileLength + xRemainder/2, localCoordinates.y * tileLength + yRemainder/2, tileLength, tileLength);
        }
        if (segment.getDirection() == Direction.LEFT) {
            self.context.fillRect((localCoordinates.x) * tileLength + xRemainder/2, localCoordinates.y * tileLength + yRemainder/2, tileLength, tileLength);
        }
        if (segment.getDirection() == Direction.UP) {
            self.context.fillRect(localCoordinates.x * tileLength + xRemainder/2, (localCoordinates.y) * tileLength + yRemainder/2, tileLength, tileLength);
        }
        if (segment.getDirection() == Direction.DOWN) {
            self.context.fillRect(localCoordinates.x * tileLength + xRemainder/2, (localCoordinates.y) * tileLength + yRemainder/2, tileLength, tileLength);
        }*/

        /*if (segment.getDirection() == Direction.RIGHT) {
            self.context.fillRect((localCoordinates.x + timePassed) * tileLength + xRemainder/2, localCoordinates.y * tileLength + yRemainder/2, tileLength, tileLength);
        }
        if (segment.getDirection() == Direction.LEFT) {
            self.context.fillRect((localCoordinates.x + timePassed) * tileLength + xRemainder/2, localCoordinates.y * tileLength + yRemainder/2, tileLength, tileLength);
        }
        if (segment.getDirection() == Direction.UP) {
            self.context.fillRect(localCoordinates.x * tileLength + xRemainder/2, (localCoordinates.y + timePassed) * tileLength + yRemainder/2, tileLength, tileLength);
        }
        if (segment.getDirection() == Direction.DOWN) {
            self.context.fillRect(localCoordinates.x * tileLength + xRemainder/2, (localCoordinates.y - timePassed) * tileLength + yRemainder/2, tileLength, tileLength);
        }
        self.context.stroke();*/


    };


    self.calcDistance = function(point1, point2) {  //calculating distance used for rendering segments in relation to head
        var dx = (point1.x - point2.x); 
        var dy = (point1.y - point2.y);
        return [dx, dy];
    };

    self.drawBorders = function(playerSnake, timePassed, tileLength, playerLength, playerHeight, gridLength, gridHeight, headCoords) {

        var xRemainder = (self.canvas.width % tileLength) / 2;
        var yRemainder = (self.canvas.height % tileLength) / 2;

        self.context.fillStyle = "black";
        self.context.beginPath();

        var northBorder = playerHeight/2 - headCoords.y;

        if (northBorder >= 0) {
            if (playerSnake.getHead().getDirection() == Direction.UP) {
                self.context.fillRect(0, 0, self.canvas.width, ((northBorder) * tileLength) + (tileLength * timePassed) + yRemainder);
            }
            else if (playerSnake.getHead().getDirection() == Direction.DOWN) {
                self.context.fillRect(0, 0, self.canvas.width, ((northBorder) * tileLength) - (tileLength * timePassed) + yRemainder);
            }
            else {
                self.context.fillRect(0, 0, self.canvas.width, northBorder * tileLength + yRemainder);
            }
        }
        
        var southBorder = playerHeight/2 - (gridHeight - headCoords.y) - 1;

        if (southBorder >= 0) {
            if (playerSnake.getHead().getDirection() == Direction.DOWN) {
                self.context.fillRect(0, self.canvas.height - ((southBorder) * tileLength) - (tileLength * timePassed) - yRemainder, self.canvas.width, self.canvas.height);
            }
            else if (playerSnake.getHead().getDirection() == Direction.UP) {
                self.context.fillRect(0, self.canvas.height - ((southBorder) * tileLength) + (tileLength * timePassed) - yRemainder, self.canvas.width, self.canvas.height);
            }
            else {
                self.context.fillRect(0, self.canvas.height - ((southBorder) * tileLength) - yRemainder, self.canvas.width, self.canvas.height);
            }
        }

        var westBorder = playerLength/2 - headCoords.x;
        if (westBorder >= 0) {
            if (playerSnake.getHead().getDirection() == Direction.RIGHT) {
                self.context.fillRect(0, 0, ((westBorder) * tileLength) - (tileLength * timePassed) + xRemainder, self.canvas.height)
            }
            else if (playerSnake.getHead().getDirection() == Direction.LEFT) {
                self.context.fillRect(0, 0, ((westBorder) * tileLength) + (tileLength * timePassed) + xRemainder, self.canvas.height)
            }
            else {
                self.context.fillRect(0, 0, (westBorder * tileLength) + xRemainder, self.canvas.height)
            }
        }

        var eastBorder = playerLength/2 - (gridLength - headCoords.x) - 1;
        if (eastBorder >= 0) {
            if (playerSnake.getHead().getDirection() == Direction.LEFT) {
                self.context.fillRect(self.canvas.width - ((eastBorder) * tileLength) + (tileLength * timePassed) - xRemainder, 0, self.canvas.width, self.canvas.height);
            }
            else if (playerSnake.getHead().getDirection() == Direction.RIGHT) {
                self.context.fillRect(self.canvas.width - ((eastBorder) * tileLength) - (tileLength * timePassed) - xRemainder, 0, self.canvas.width, self.canvas.height);
            }
            else {
                self.context.fillRect(self.canvas.width - ((eastBorder) * tileLength) - xRemainder, 0, self.canvas.width, self.canvas.height);
            }
        }

        self.context.stroke();
    };
    
    self.drawLatticeSmooth = function(tileLength, timePassed) {
        var xOffset = self.canvas.width%tileLength/2;
        var yOffset = self.canvas.height%tileLength/2;

        for (var i = 0; i < self.canvas.width/tileLength + 1; i++) {
            var currX = (i + timePassed) * (tileLength + xOffset);
            self.context.moveTo(currX, 0);
            self.context.lineTo(currX, self.canvas.height)
            self.context.stroke();
        }
    };

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
    };


    self.drawSnakeHead = function(localCoordinates, tileLength) {
        var xRemainder = self.canvas.width%tileLength;
        var yRemainder = self.canvas.height%tileLength;

        self.context.fillStyle = "green";
        self.context.beginPath();
        self.context.fillRect(localCoordinates.x * tileLength + xRemainder/2, localCoordinates.y * tileLength + yRemainder/2, tileLength, tileLength);

        self.context.fillStyle = "black";

        self.context.beginPath();
        self.context.arc(localCoordinates.x * tileLength + tileLength/4 + xRemainder/2, localCoordinates.y * tileLength + tileLength/4 + yRemainder/2, tileLength * 0.1, 0, 2 * Math.PI);
        self.context.fill();

        self.context.beginPath();
        self.context.arc(localCoordinates.x * tileLength + tileLength/(4/3) + xRemainder/2, localCoordinates.y * tileLength + tileLength/4 + yRemainder/2, tileLength * 0.1, 0, 2 * Math.PI);
        self.context.fill(); 

        self.context.beginPath();
        self.context.arc(localCoordinates.x * tileLength + xRemainder/2 + tileLength/2, localCoordinates.y * tileLength + yRemainder/2 + tileLength/2, tileLength * 0.35, Math.PI, 2 * Math.PI, 1);
        self.context.stroke();
    };

    self.drawApple = function(apple, localCoordinates, tileLength) {
        var coords = apple.getCoordinates();
        var xRemainder = self.canvas.width%tileLength/2;
        var yRemainder = self.canvas.height%tileLength/2;

        self.context.fillStyle = "red";
        self.context.beginPath();
        self.context.arc(localCoordinates.x * tileLength + xRemainder + tileLength/2, localCoordinates.y * tileLength + yRemainder + tileLength/2, tileLength * 0.45, 0, 2 * Math.PI);
        self.context.fill();
        self.context.stroke();
    };

    self.clear = function() {
        self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
    };

    

    self.cycle = function(grid, snakes, apples, playerSnake) {
        self.clear();
        self.drawPlayerGrid(grid, snakes, apples, playerSnake);
    };
}

module.exports = Renderer;