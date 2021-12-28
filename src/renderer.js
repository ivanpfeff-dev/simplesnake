function Renderer() {
    var self = this;
    self.canvas = null;
    self.context = null;

    self.setCanvas = function(canvas){
        self.canvas = canvas;
        self.context = canvas.getContext("2d");
    };

    self.drawGrid = function (width, height){
        var pixelWidth = self.canvas.width/width;
        var pixelHeight = self.canvas.height/height;
        for (var i = 0; i < width; i++) {
            var currentX = i * pixelWidth;
            self.context.moveTo(currentX,0);
            self.context.lineTo(currentX, self.canvas.height);
            self.context.stroke();
        }

        for (var h = 0; h < height; h++) {
            var currentY = h * pixelHeight;
            self.context.moveTo(0,currentY);
            self.context.lineTo(self.canvas.width,currentY);
            self.context.stroke();
        }
    };

    self.drawSegment = function(segment){

    };

    self.drawSnake = function(snake){

    };

    self.drawApple = function(apple) {
        //apple has x, y
    };

    self.clear = function() {
        self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
    }
}

module.exports = Renderer;