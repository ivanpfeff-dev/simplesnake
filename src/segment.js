function Segment(x,y,direction) {
    var self = this;
    self.x = x;
    self.y = y;
    self.direction = direction;
    
    self.getDirection = function() {
        return self.direction;
    }
    
    self.setDirection = function(direction) {
        self.direction = direction;  
    };
    
    self.getCoordinates = function () {
        return [x, y];  
    };
    
    self.setCoordinates = function(x, y) {
        self.x = x;
        self.y = y;
    }
}

module.exports = Segment;