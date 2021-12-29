function Renderer() {
    var self = this;
    self.canvas = null;
    self.context = null;
    self.tileLength = null;
    self.tileHeight = null;


    self.setCanvas = function(canvas){
        self.canvas = canvas;
        self.context = canvas.getContext("2d");
        self.tileLength = canvas.width/30;
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
        self.context.fillStyle = "black";
        self.context.beginPath();
        self.context.fillRect(segment.x * self.tileLength, segment.y * self.tileLength, self.tileLength, self.tileLength);
        self.context.stroke();
    };

    self.drawSnake = function(snake){
        var snakeSegments = snake.getSegments();
        for (var i = 0; i < snakeSegments.length; i++) {
            self.drawSegment(snakeSegments[i]);
        }

    };

    self.drawApple = function(apple) {

        self.context.fillStyle = "red";
        self.context.beginPath();
        self.context.arc(apple.x * self.tileLength + self.tileLength/2, apple.y * self.tileLength + self.tileLength/2, self.tileLength * 0.45, 0, 2 * Math.PI);
        self.context.fill();
        self.context.stroke();
        
        self.context.fillStyle = "green";
        self.context.beginPath();
        self.context.arc(apple.x * self.tileLength + self.tileLength/2, apple.y * self.tileLength + self.tileHeight/1.5, self.tileLength/4, 0, Math.Pi);
        self.context.fill();
        self.context.stroke();
        //apple has x, y
    };

    self.clear = function() {
        self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
    }
}

module.exports = Renderer;