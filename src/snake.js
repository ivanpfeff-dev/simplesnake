var Direction = require('./direction');
var Segment = require('./segment'); 

function Snake(coords, direction) {
    var self = this;
    self.segments = [];
    self.segments.push(new Segment(coords,direction));
    self.turnLock = false;

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
            var previousPosition = Direction.getPreviousPosition(lastSegment.getCoordinates(), lastSegment.getDirection());
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
    
    self.processMovement = function() {  
        var head = self.getHead();
        var currentDirection = head.getDirection();
        var lastDirection = head.getDirection();
        
        for(var i = 0; i < self.segments.length; i++) {
            var segment = self.segments[i];

            var nextPosition = Direction.getNextPosition(segment.getCoordinates(), segment.getDirection());
            segment.setCoordinates(nextPosition);

            currentDirection = segment.getDirection();
            segment.setDirection(lastDirection);
            lastDirection = currentDirection;
        }

        self.turnLock = false;
    };
}

module.exports = Snake;