function Point(x, y){
    var self = this;

    self.x = x;
    self.y = y;
}

Point.prototype.getHash = function() {
    return `x${this.x}y${this.y}`
}

module.exports = Point;