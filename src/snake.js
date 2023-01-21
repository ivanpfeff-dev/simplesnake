var Direction = require('./direction');
var Segment = require('./segment'); 

function Snake(coords, direction) {
    var self = this;
    self.segments = [];
    self.segments.push(new Segment(coords,direction));
    self.segments.push(new Segment(coords,Direction.NONE));
    self.turnLock = false;
    self.moveTime = Date.now(); //each individual snake has a starting time
    self.score = 0;

    self.getScore = function() {
        return self.score;
    }

    self.addScore = function(score) {
        self.score += score;
    }

    self.getMoveTime = function() {
        return self.moveTime;
    }

    self.updateMoveTime = function() {
        self.moveTime = Date.now();
    }

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

        var lastSegment = self.getTail();
        var lastCoords = lastSegment.getCoordinates();
        for(var i = 0; i < length; i++) {
            self.segments.push(new Segment(lastCoords, Direction.NONE));    
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
    self.die = function() {
        self = null;
    }
}

module.exports = Snake;