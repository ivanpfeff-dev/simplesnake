/*
First find all the points within render distance
translate points to render space
render
update render functions to take local coordinates
*/
var Point = require("./point");
const Segment = require("./segment");

function Renderer() {
    var self = this;
    self.canvas = null;
    self.context = null;
    self.tileLength = null;
    self.tileHeight = null;


    self.setCanvas = function(canvas){
        self.canvas = canvas;
        self.context = canvas.getContext("2d");
        self.tileLength = canvas.width/30;
    };

    self.drawGrid = function (grid){
        var gridWidth = grid.getWidth();
        var gridHeight = grid.getHeight();

        for (var i = 0; i < gridWidth; i++) {

            var currentX = i * self.tileLength;
            self.context.moveTo(currentX,0);
            self.context.lineTo(currentX, self.canvas.height);
            self.context.stroke();
        }

        for (var h = 0; h < gridHeight; h++) {
            var currentY = h * self.tileLength;
            self.context.moveTo(0,currentY);
            self.context.lineTo(self.canvas.width,currentY);
            self.context.stroke();
        }
    };

    self.calcDistance = function(point1, point2) {
        var dx = (point1.x - point2.x); 
        var dy = (point1.y - point2.y);
        return [dx, dy];
    };

    self.drawPlayerGrid = function(grid, snakes, apples, playerSnake){
        var playerGridLength = 10;
        var playerGridHeight = 10;
        var playerTileLength = self.canvas.width/playerGridLength;

        var playerSnakeHead = playerSnake.getHead();

        var camera = new Point(playerGridLength/2, playerGridHeight/2);
        self.drawTile(camera, playerTileLength, "black");

        //var cameraSnakeDifferenceX = (camera.x - playerSnakeHead.getCoordinates().x);
        //var cameraSnakeDifferenceY = (camera.y - playerSnakeHead.getCoordinates().y);
        //console.log(`Actual x: ${playerSnake.getHead().getCoordinates().x}, y: ${playerSnake.getHead().getCoordinates().y}`)
        //console.log(`differenceX: ${cameraSnakeDifferenceX}, differenceY: ${cameraSnakeDifferenceY}`);

        /*self.context.fillStyle = "black";
        self.context.beginPath();
        self.context.fillRect(playerGridLength/2 * playerTileLength , playerGridHeight/2 * playerTileLength, playerTileLength, playerTileLength);
        self.context.moveTo(camera.x * playerGridLength - playerGridLength, camera.y * playerGridLength - playerGridLength,);
        self.context.lineTo(camera.x * playerGridLength + playerGridLength, camera.y * playerGridLength - playerGridLength);
        self.context.stroke();
        self.context.moveTo(camera.x * playerGridLength - playerGridLength, camera.y * playerGridLength + playerGridLength);
        self.context.lineTo(camera.x * playerGridLength - playerGridLength, camera.y * playerGridLength - playerGridLength);
        self.context.stroke();
        self.context.fill(); //center is gridheight/2, gridlength/2*/

        var upperThresholdX = playerGridLength/2 - playerSnakeHead.getCoordinates().x; // - 0
        var upperThresholdY = playerGridHeight/2 - playerSnakeHead.getCoordinates().y; // - 0

        self.context.fillStyle = "black";
        self.context.beginPath();
        self.context.fillRect(0,0,upperThresholdX * playerTileLength, self.canvas.height);
        self.context.fill();

        self.context.beginPath();
        self.context.fillRect(0,0, self.canvas.width, upperThresholdY * playerTileLength);
        self.context.fill();      
        
        for (var i = 0; i < playerGridHeight; i++) {        //drawing grid

            var currentX = i * playerTileLength;
            self.context.moveTo(currentX,0);
            self.context.lineTo(currentX, self.canvas.height);
            self.context.stroke();
        }

        for (var h = 0; h < playerGridHeight; h++) {
            var currentY = h * playerTileLength;
            self.context.moveTo(0,currentY);
            self.context.lineTo(self.canvas.width, currentY);
            self.context.stroke();
        }
        var allSnakeSegments = [];
        for (var i = 0; i < snakes.length; i++) {
            var tempSegments = snakes[i].getSegments();
            for (var h  = 0; h < tempSegments.length; h++) {
                allSnakeSegments.push(tempSegments[h]);
            }
        };

        for (var i = 0; i < allSnakeSegments.length; i++) {
            var tempSegment = allSnakeSegments[i];
            [dx, dy] = self.calcDistance(playerSnakeHead.getCoordinates(), tempSegment.getCoordinates()); //calculating distance between segment and player head

            if (Math.abs(dx) < playerGridLength && Math.abs(dy) < playerGridHeight) {
                var renderCoordinates = new Point(camera.x - dx, camera.y - dy);
                self.drawSegment(tempSegment, renderCoordinates, playerTileLength);

            }
        }

        for (var i = 0; i < apples.length; i++) {
            var tempApple = apples[i];
            [dx, dy] = self.calcDistance(playerSnakeHead.getCoordinates(), tempApple.getCoordinates())
            
            if (Math.abs(dx) < playerGridLength && Math.abs(dy) < playerGridHeight) {
                var renderCoordinates = new Point(camera.x - dx, camera.y - dy);
                self.drawApple(tempApple, renderCoordinates, playerTileLength);
                //renderableApples.push(tempApple);
            }
            
        }
        //self.drawSnakeHead(playerSnakeApparentHead, playerTileLength);
        //console.log(`head: ${playerSnakeHead.getCoordinates().x}, ${playerSnakeHead.getCoordinates().y}`);
    };

    self.drawTile = function(localCoordinates, tileLength, color) {
        self.context.fillStyle = color;

        self.context.beginPath();
        self.context.fillRect(localCoordinates.x * tileLength, localCoordinates.y * tileLength, tileLength, tileLength);
        self.context.stroke();
    }

    self.drawSegment = function(segment, localCoordinates, tileLength){
        var segmentCoordinates = segment.getCoordinates();

        self.context.fillStyle = "green";
        self.context.beginPath();
        self.context.fillRect(localCoordinates.x * tileLength, localCoordinates.y * tileLength, tileLength, tileLength);
        self.context.stroke();
    };

    self.drawSnakeHead = function(segment, localCoordinates, tileLength) {
        var segmentCoordinates = segment.getCoordinates();

        self.context.fillStyle = "green";
        self.context.beginPath();
        self.context.fillRect(localCoordinates.x * tileLength, localCoordinates.y * tileLength, tileLength, tileLength);

        self.context.fillStyle = "black";

        self.context.beginPath();
        self.context.arc(localCoordinates.x * tileLength + tileLength/4, localCoordinates.y * tileLength + tileLength/4, tileLength * 0.1, 0, 2 * Math.PI);
        self.context.fill();

        self.context.beginPath();
        self.context.arc(localCoordinates.x * tileLength + tileLength/(4/3), localCoordinates.y * tileLength + tileLength/4, tileLength * 0.1, 0, 2 * Math.PI);
        self.context.fill(); 

        self.context.beginPath();
        self.context.arc(localCoordinates.x * tileLength + tileLength/2, localCoordinates.y * tileLength + tileLength/2, tileLength * 0.35, Math.PI, 2 * Math.PI, 1);
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
        self.context.fillStyle = "red";
        self.context.beginPath();
        self.context.arc(localCoordinates.x * tileLength + tileLength/2, localCoordinates.y * tileLength + tileLength/2, tileLength * 0.45, 0, 2 * Math.PI);
        self.context.fill();
        self.context.stroke();
        
        self.context.fillStyle = "green";
        self.context.beginPath();
        self.context.arc(coords.x * tileLength + tileLength/2, coords.y * tileLength + tileLength/1.5, tileLength/4, 0, Math.Pi);
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