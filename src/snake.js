function Snake() {
    var self = this;
    self.segments = [];
    self.getLastSegment = function() {
        return self.segments[self.segments.length-1]
    }
    self.addSegment = function() {
        var lastSegment = self.getLastSegment();
        self.segments.push();
    }
     
}