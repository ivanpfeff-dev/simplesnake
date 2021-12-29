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
        var countList = new CountList();
        
        var snakesWithSegments = [];
        var allSegments = [];

        for(var i = 0; i < self.snakes.length; i++){
            snakesWithSegments.push([self.snakes[i], self.snakes[i].moveSegments()]);
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
    };

    self.cycle = function() {
        if(Date.now() - self.lastGridUpdate > self.updateSpeed){
            self.lastGridUpdate = Date.now();
            self.processOneTurn();
        }
    };
}

module.exports = Grid;