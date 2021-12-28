var Segment = require('./segment');

function Direction() {}

Direction.UP = 1;
Direction.DOWN = 2;
Direction.LEFT = 3;
Direction.RIGHT = 4;

Direction.getNextPosition = function(segment) {
    if(segment.direction === Direction.UP){
        return new Segment(segment.x, segment.y - 1, segment.direction);
    }
    if(segment.direction === Direction.DOWN){
        return new Segment(segment.x, segment.y + 1, segment.direction);
    }
    if(segment.direction === Direction.LEFT){
        return new Segment(segment.x - 1, segment.y, segment.direction);
    }
    if(segment.direction === Direction.RIGHT){
        return new Segment(segment.x + 1, segment.y, segment.direction);
    }
};

Direction.getPreviousPosition = function(segment) {
    if(segment.direction === Direction.UP){
        return new Segment(segment.x, segment.y + 1, segment.direction);
    }
    if(segment.direction === Direction.DOWN){
        return new Segment(segment.x, segment.y - 1, segment.direction);
    }
    if(segment.direction === Direction.LEFT){
        return new Segment(segment.x + 1, segment.y, segment.direction);
    }
    if(segment.direction === Direction.RIGHT){
        return new Segment(segment.x - 1, segment.y, segment.direction);
    }
}

module.exports = Direction;