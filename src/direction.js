var Segment = require('./segment');

function Direction() {
    var self = this;

    self.UP = 1;
    self.DOWN = 2;
    self.LEFT = 3;
    self.RIGHT = 4;

    self.getNextPosition = function(segment) {
        if(segment.direction === self.UP){
            return new Segment(segment.x, segment.y - 1, segment.direction);
        }
        if(segment.direction === self.DOWN){
            return new Segment(segment.x, segment.y + 1, segment.direction);
        }
        if(segment.direction === self.LEFT){
            return new Segment(segment.x - 1, segment.y, segment.direction);
        }
        if(segment.direction === self.RIGHT){
            return new Segment(segment.x + 1, segment.y, segment.direction);
        }
    };

    self.getPreviousPosition = function(segment) {
        if(segment.direction === self.UP){
            return new Segment(segment.x, segment.y + 1, segment.direction);
        }
        if(segment.direction === self.DOWN){
            return new Segment(segment.x, segment.y - 1, segment.direction);
        }
        if(segment.direction === self.LEFT){
            return new Segment(segment.x + 1, segment.y, segment.direction);
        }
        if(segment.direction === self.RIGHT){
            return new Segment(segment.x - 1, segment.y, segment.direction);
        }
    }
}