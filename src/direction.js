const Point = require('./point');
var Segment = require('./segment');

function Direction() {}

Direction.UP = 1;
Direction.DOWN = 2;
Direction.LEFT = 4;
Direction.RIGHT = 5;
Direction.NONE = 8;

Direction.getNextPosition = function(coords, direction) {
    if(direction === Direction.UP){
        return new Point(coords.x, coords.y - 1);
    }
    if(direction === Direction.DOWN){
        return new Point(coords.x, coords.y + 1);
    }
    if(direction === Direction.LEFT){
        return new Point(coords.x - 1, coords.y);
    }
    if(direction === Direction.RIGHT){
        return new Point(coords.x + 1, coords.y);
    }
    if(direction == Direction.NONE){
        return coords;
    }
};

Direction.getPreviousPosition = function(coords, direction) {
    if(direction === Direction.UP){
        return new Point(coords.x, coords.y + 1);
    }
    if(direction === Direction.DOWN){
        return new Point(coords.x, coords.y - 1);
    }
    if(direction === Direction.LEFT){
        return new Point(coords.x + 1, coords.y);
    }
    if(direction === Direction.RIGHT){
        return new Point(coords.x - 1, coords.y);
    }
    if(direction == Direction.NONE){
        return coords;
    }
};

Direction.canTurn = function(oldDirection, newDirection) {
    return Math.abs(newDirection - oldDirection) > 1;
};

module.exports = Direction;