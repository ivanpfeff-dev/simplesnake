const Apple = require("./apple");
const CountList = require("./countList");
const Direction = require("./direction");
const Point = require("./point");

function Grid (width, height, updateSpeed) {
    var self = this;

    self.snakes = [];
    self.apples = [];
    self.width = width;
    self.height = height;
    self.updateSpeed = updateSpeed;
    self.playerSnake = null;
    self.lastGridUpdate = Date.now();

    self.getUpdateSpeed = function() {
        return self.updateSpeed;
    }
    
    self.getLastUpdate = function() {
        return self.lastGridUpdate;
    }

    self.getWidth = function() {
        return self.width;
    };

    self.getHeight = function () {
        return self.height;
    };

    self.getSnakes = function () {
        return self.snakes;
    };

    self.getApples = function () {
        return self.apples;
    };

    self.addSnake = function(snake, isPlayerSnake) {
        if(isPlayerSnake){
            self.playerSnake = snake;
        }

        self.snakes.push(snake);
    };

    self.addApple = function(apple) {
        self.apples.push(apple);
    };

    self.generateApple = function () {
        var countList = new CountList();

        for(var i = 0; i < self.apples.length; i++){
            countList.push(self.apples[i].getCoordinates().getHash());
        }

        for(var i = 0; i < self.snakes.length; i++){
            var segments = self.snakes[i].getSegments();
            for(var j = 0; j < segments.length; j++){
                countList.push(segments[i].getCoordinates().getHash());
            }
        }

        var availablePoints = [];
        for(var i = 0; i < self.width; i++){
            for(var j = 0; j < self.height; j++) {
                var testPoint = new Point(i, j);
                if(countList.getCount(testPoint.getHash()) === 0){
                    availablePoints.push(testPoint);
                }
            }
        }

        var selectedPoint = Math.floor((Math.random() * availablePoints.length) + 1);
        var appleCoordinates = availablePoints[selectedPoint];

        var apple = new Apple(appleCoordinates);
        self.apples.push(apple);
    };

    self.processOneTurn = function () {
        var countList = new CountList();
        
        var snakesWithSegments = [];
        var allSegments = [];

        for(var i = 0; i < self.snakes.length; i++){
            snakesWithSegments.push([self.snakes[i], self.snakes[i].moveSegments()]);
            self.snakes[i].updateMoveTime();
            //console.log(self.snakes[i].getMoveTime());
        }


        for(var i = 0; i < snakesWithSegments.length; i++){
            [snake, segments] = snakesWithSegments[i];
            allSegments.push(segments);
        }

        allSegments = allSegments.flat();

        for(var i = 0; i < allSegments.length; i++){
            countList.push(allSegments[i].getCoordinates().getHash());
        }

        for(var i = 0; i < snakesWithSegments.length; i++){
            [snake, segments] = snakesWithSegments[i];
            var head = segments[0];
            var headCoords = head.getCoordinates();

            if(countList.getCount(headCoords.getHash()) > 1 ||
                (headCoords.x < 0 || headCoords.x > self.width || headCoords.y < 0 || headCoords.y > self.height)) 
            {
                var snakeIdx = self.snakes.indexOf(snake);
                if(snakeIdx !== -1){
                    self.snakes.splice(snakeIdx, 1);
                }
            }
        }

        for(var i = 0; i < snakesWithSegments.length; i++){
            [snake, segments] = snakesWithSegments[i];
            snake.setSegments(segments);
        };

        var appleHash = {};
        for(var i = 0; i < self.apples.length; i++){
            var apple = self.apples[i];
            var appleCoords = apple.getCoordinates();
            appleHash[appleCoords.getHash()] = apple;
        }

        for(var i = 0; i < self.snakes.length; i++){
            var snake = self.snakes[i];
            var snakeHead = snake.getHead();
            var headCoords = snakeHead.getCoordinates();
            var headHash = headCoords.getHash();
            if(headHash in appleHash) {
                var apple = appleHash[headHash];
                var appleIdx = self.apples.indexOf(apple);
                if(appleIdx !== -1){
                    self.apples.splice(appleIdx, 1);
                }
                snake.addSegment(3);
                snake.addScore(1);
            }
        }
    };

    self.cycle = function() {
        if(Date.now() - self.lastGridUpdate > self.updateSpeed){
            self.lastGridUpdate = Date.now();
            self.processOneTurn();
        }
    };
}

module.exports = Grid;