function Renderer() {
    var self = this;
    self.canvas = null;
<<<<<<< Updated upstream
    
    self.setCanvas = function(canvas){
        self.canvas = canvas;
    };

    self.drawGrid = function (width, height){
        
=======
    self.context = null;

    self.setCanvas = function(canvas){
        self.canvas = canvas;
        self.context = canvas.getContext("2d");
    };

    self.drawGrid = function (width, height){
        for (var i = 0; i < self.canvas.width; i += width) {
            self.context.moveTo(i,0);
            self.context.lineTo(i, height);
            self.context.stroke();
        }

        for (var h = 0; h < self.canvas.height; i += height) {
            self.context.moveTo(0,i);
            self.context.lineTo(width,i);
            self.context.stroke();
        }
>>>>>>> Stashed changes
    };

    self.drawSegment = function(segment){

    };

    self.drawSnake = function(snake){

    };

    self.drawApple = function(apple) {
        //apple has x, y
    };
}

module.exports = Renderer;