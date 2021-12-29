var Direction = require('./direction');
var Segment = require('./segment'); 

function Snake(coords, direction) {
    var self = this;
    self.segments = [];
    self.segments.push(new Segment(coords,direction));
    self.segments.push(new Segment(coords,Direction.NONE));
    self.turnLock = false;

    self.getSegments = function() {
        return self.segments;
    };
    
    self.setSegments = function(segments) {
        self.turnLock = false;
        self.segments = segments;
    }
    
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
            var previousPosition = Direction.getPreviousPosition(lastSegment.getCoordinates(), Direction.NONE);
            self.segments.push(new Segment(previousPosition, lastSegment.getDirection()));    
        }
    };    

    self.turn = function(direction) {
        var head = self.getHead();
        if(!self.turnLock && Direction.canTurn(head.getDirection(), direction)){
            head.setDirection(direction);
            self.turnLock = true;
        }
    };
    
    self.moveSegments = function() {  
        var shiftedSegments = [];

        for(var i = 0; i < self.segments.length; i++){
            shiftedSegments.push(self.segments[i].clone());
        }

        var lastDirection = self.getHead().getDirection();
        for(var i = 0; i < shiftedSegments.length; i++){
            var segment = shiftedSegments[i];
            var currentDirection = segment.getDirection();
            var endProcess = currentDirection === Direction.NONE;

            if(endProcess) {
                segment.setDirection(lastDirection);
                break;
            }

            var nextPosition = Direction.getNextPosition(segment.getCoordinates(), currentDirection);
            segment.setCoordinates(nextPosition);

            segment.setDirection(lastDirection);
            lastDirection = currentDirection;
        }
       
        return shiftedSegments;
    };
}

module.exports = Snake;