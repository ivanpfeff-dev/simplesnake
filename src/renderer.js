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
        var dx = Math.abs(point1.x - point2.x); 
        var dy = Math.abs(point1.y - point2.y);
        return [dx, dy];
    };


    self.drawPlayerGrid = function(grid, snakes, apples, playerSnake){
        var playerGridLength = 10;
        var playerGridHeight = 10;
        var playerTileLength = self.canvas.width/playerGridLength;

        var playerSnakeSegments = playerSnake.getSegments();
        var playerSnakeHead = playerSnake.getHead().clone();
        var playerSnakeApparentHead = playerSnake.getHead();

        var camera = new Point(playerGridLength/2, playerGridHeight/2);

        //var cameraSnakeDifferenceX = (camera.x - playerSnakeHead.getCoordinates().x);
        //var cameraSnakeDifferenceY = (camera.y - playerSnakeHead.getCoordinates().y);
        console.log(`Actual x: ${playerSnake.getHead().getCoordinates().x}, y: ${playerSnake.getHead().getCoordinates().y}`)
        //console.log(`differenceX: ${cameraSnakeDifferenceX}, differenceY: ${cameraSnakeDifferenceY}`);

        var snakeHeadTranslation = new Point(((playerSnakeHead.getCoordinates().x - camera.x) + playerSnakeHead.getCoordinates().x), ((camera.y - playerSnakeHead.getCoordinates().y) + playerSnakeHead.getCoordinates().y));
        playerSnakeHead.setCoordinates(snakeHeadTranslation);



        //self.context.fillStyle = "black";
        //self.context.beginPath();
        //self.context.fillRect(playerGridLength/2 * playerTileLength , playerGridHeight/2 * playerTileLength, playerTileLength, playerTileLength);
        //self.context.moveTo(camera.x * playerGridLength - playerGridLength, camera.y * playerGridLength - playerGridLength,);
        //self.context.lineTo(camera.x * playerGridLength + playerGridLength, camera.y * playerGridLength - playerGridLength);
        //self.context.stroke();
        //self.context.moveTo(camera.x * playerGridLength - playerGridLength, camera.y * playerGridLength + playerGridLength);
        //self.context.lineTo(camera.x * playerGridLength - playerGridLength, camera.y * playerGridLength - playerGridLength);
        //self.context.stroke();
        //self.context.fill(); //center is gridheight/2, gridlength/2



        
        for (var i = 0; i < playerGridHeight; i++) {

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
            var translate = new Point((camera.x - allSnakeSegments[i].getCoordinates().x) + allSnakeSegments[i].getCoordinates().x, (camera.y - allSnakeSegments[i].getCoordinates().y + allSnakeSegments[i].getCoordinates().y))
            allSnakeSegments[i].setCoordinates(translate);
        }

        for (var i = 0; i < allSnakeSegments.length; i++) {
            var tempSegment = allSnakeSegments[i];
            [dx, dy] = self.calcDistance(playerSnakeHead.getCoordinates(), tempSegment.getCoordinates());

            if (dx < playerGridLength && dy < playerGridHeight) {
                    self.drawSegment(allSnakeSegments[i], playerTileLength);
                    //console.log(`Segment at ${tempSegment.getCoordinates().x},${tempSegment.getCoordinates().y}.`);
                    //console.log(`dx: ${dx}, dy: ${dy}`);
                    //console.log(`player head at ${playerSnakeHead.getCoordinates().x},${playerSnakeHead.getCoordinates().y}`) 
            }
        }

        for (var i = 0; i < apples.length; i++) {
            var tempApple = apples[i];
            [dx, dy] = self.calcDistance(playerSnakeHead.getCoordinates(), tempApple.getCoordinates())
            
            if (dx < playerGridLength && dy < playerGridHeight) {
                self.drawApple(apples[i], playerTileLength);
            }
            
        }
        self.drawSnakeHead(playerSnakeHead, playerTileLength);
        //self.drawSnakeHead(playerSnakeApparentHead, playerTileLength);
        //console.log(`head: ${playerSnakeHead.getCoordinates().x}, ${playerSnakeHead.getCoordinates().y}`);
    };

    self.drawSegment = function(segment, tileLength){
        var segmentCoordinates = segment.getCoordinates();

        self.context.fillStyle = "green";
        self.context.beginPath();
        self.context.fillRect(segmentCoordinates.x * tileLength, segmentCoordinates.y * tileLength, tileLength, tileLength);
        self.context.stroke();
    };

    self.drawSnakeHead = function(segment, tileLength) {
        var segmentCoordinates = segment.getCoordinates();

        self.context.fillStyle = "green";
        self.context.beginPath();
        self.context.fillRect(segmentCoordinates.x * tileLength, segmentCoordinates.y * tileLength, tileLength, tileLength);

        self.context.fillStyle = "black";

        self.context.beginPath();
        self.context.arc(segmentCoordinates.x * tileLength + tileLength/4, segmentCoordinates.y * tileLength + tileLength/4, tileLength * 0.1, 0, 2 * Math.PI);
        self.context.fill();

        self.context.beginPath();
        self.context.arc(segmentCoordinates.x * tileLength + tileLength/(4/3), segmentCoordinates.y * tileLength + tileLength/4, tileLength * 0.1, 0, 2 * Math.PI);
        self.context.fill(); 

        self.context.beginPath();
        self.context.arc(segmentCoordinates.x * tileLength + tileLength/2, segmentCoordinates.y * tileLength + tileLength/2, tileLength * 0.35, Math.PI, 2 * Math.PI, 1);
        self.context.stroke();
    };

    self.drawSnake = function(snake){
        var snakeSegments = snake.getSegments();
        self.drawSnakeHead(snakeSegments[0]);
        for (var i = 1; i < snakeSegments.length; i++) {
            self.drawSegment(snakeSegments[i]);
        }

    };

    self.drawApple = function(apple, tileLength) {
        var coords = apple.getCoordinates();
        self.context.fillStyle = "red";
        self.context.beginPath();
        self.context.arc(coords.x * tileLength + tileLength/2, coords.y * tileLength + tileLength/2, tileLength * 0.45, 0, 2 * Math.PI);
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