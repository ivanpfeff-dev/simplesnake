var Direction = require('./direction');
var Segment = require('./segment'); 

function Snake(x,y) {
    var self = this;
    self.segments = [];
    self.segments.push(new Segment(x,y,Direction.UP));

    self.getSegments = function() {
        return self.segments;
    };
    
    self.getHead = function () {
        return self.segments[0];  
    };

    self.getTail = function() {
        return self.segments[self.segments.length-1]
    };

    self.addSegment = function(length) {
        if(!length) {
            length = 1;
        }
        for(var i = 0; i < length; i++){
            var lastSegment = self.getTail();
            self.segments.push(Direction.getPreviousPosition(lastSegment));    
        }
    };    
    
    self.processMovement = function(direction) {  
        var head = self.getHead();
        var currentDirection = 0;
        var lastDirection = direction;
        head.setDirection(direction);
        
        for(var i = 0; i < self.segments.length; i++) {
            var segment = self.segments[i];

            var nextPosition = Direction.getNextPosition(segment);
            segment.setCoordinates(nextPosition.x, nextPosition.y);

            currentDirection = segment.getDirection();
            segment.setDirection(lastDirection);
            lastDirection = currentDirection;
        }
    };
}

module.exports = Snake;