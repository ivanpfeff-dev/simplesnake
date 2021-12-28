var Direction = require('./direction');
var Direction = require('./segment'); 
function Snake(x,y) {
    var self = this;
    self.segments = [];
    self.segments.push(new Segment(x,y,Direction.UP));

    self.getLastSegment = function() {
        return self.segments[self.segments.length-1]
    }
    self.addSegment = function() {
        var lastSegment = self.getLastSegment();
        self.segments.push(Direction.getPreviousPosition(lastSegment));
    }
     
}