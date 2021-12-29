const Point = require("./point");

function Segment(coords, direction) {
    var self = this;
    self.coords = coords;
    self.direction = direction;
    
    self.getDirection = function() {
        return self.direction;
    }
    
    self.setDirection = function(direction) {
        self.direction = direction;  
    };
    
    self.getCoordinates = function () {
        return self.coords;
    };
    
    self.setCoordinates = function(coords) {
        self.coords = coords;
    };

    self.clone = function(){
        return new Segment(self.coords, self.direction);
    };
}

module.exports = Segment;