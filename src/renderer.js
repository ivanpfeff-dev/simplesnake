function Renderer() {
    var self = this;
    self.canvas = null;
    
    self.setCanvas = function(canvas){
        self.canvas = canvas;
    };

    self.drawGrid = function (width, height){
        
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