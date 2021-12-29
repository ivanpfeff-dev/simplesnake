const CountList = require("./countList");
const Direction = require("./direction");

function Grid (width, height, updateSpeed) {
    var self = this;

    self.snakes = [];
    self.apples = [];
    self.width = width;
    self.height = height;
    self.updateSpeed = 1000 - updateSpeed;
    self.playerSnake = null;
    self.lastGridUpdate = Date.now();

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

    self.processOneTurn = function () {
        var allSegments = [];
        var countList = new CountList();
        
        for(var i = 0; i < self.snakes.length; i++) {
            allSegments.push(self.snakes[i].getSegments());
        }

        allSegments = allSegments.flat();

        var clonedSegments = [];
        for(var i = 0; i < allSegments.length; i++){
            clonedSegments.push(allSegments[i].clone());
        }

        for(var i = 0; i < clonedSegments.length; i++){
            var segment = clonedSegments[i];
            var nextPos = Direction.getNextPosition(segment.getCoordinates(), segment.getDirection());
            countList.push(nextPos.getHash());
        }

        for(var i = 0; i < self.snakes.length; i++){
            var snake = self.snakes[i];
            var head = snake.getHead();
            var headCoords = head.getCoordinates();
            if(!headCoords || !headCoords.getHash){
                debugger;
            }
            if(countList.getCount(headCoords.getHash()) > 1 ||
                (headCoords.x < 0 || headCoords.x > self.width || headCoords.y < 0 || headCoords.y > self.height)) 
            {
                console.log("Collision!!!");
            }
        }

        for(var i = 0; i < self.snakes.length; i++){
            self.snakes[i].processMovement();
        };
    };

    self.cycle = function() {
        if(Date.now() - self.lastGridUpdate > self.updateSpeed){
            self.lastGridUpdate = Date.now();
            self.processOneTurn();
        }
    };
}

module.exports = Grid;