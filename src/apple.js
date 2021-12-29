function Apple(coords) {
    var self = this;
    self.coords = coords;

    self.getCoordinates = function () {
        return self.coords;
    }
}

module.exports = Apple;