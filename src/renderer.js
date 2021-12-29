function Renderer() {
    var self = this;
    self.canvas = null;
    self.context = null;
    self.tileLength = null;


    self.setCanvas = function(canvas){
        self.canvas = canvas;
        self.context = canvas.getContext("2d");
        self.tileLength = canvas.width/30
    };

    self.drawGrid = function (width, height){
        for (var i = 0; i < width; i++) {

            var currentX = i * self.tileLength;
            self.context.moveTo(currentX,0);
            self.context.lineTo(currentX, self.canvas.height);
            self.context.stroke();
        }

        for (var h = 0; h < height; h++) {
            var currentY = h * self.tileLength;
            self.context.moveTo(0,currentY);
            self.context.lineTo(self.canvas.width,currentY);
            self.context.stroke();
        }
    };

    self.drawSegment = function(segment){
        self.context.beginPath();
        self.context.fillRect(segment[0] * self.tileLength - self.tileLength, segment[1] * self.tileLength - self.tileLength, self.tileLength, self.tileLength);
        self.context.stroke();
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