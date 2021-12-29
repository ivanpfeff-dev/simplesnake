var Snake = require('./snake');
var Segment = require('./segment');
var Renderer = require('./renderer');
var Direction = require('./direction');
var InputManager = require('./inputManager');
var Apple = require('./apple');

function Game (window, canvas) {
    var self = this;

    window.requestAnimationFrame = (function(){
        return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                function (callback) {
                  window.setTimeout(callback, 1000 / 60);
                };
      })();

    self.renderer = new Renderer();
    self.renderer.setCanvas(canvas);
    self.inputManager = new InputManager(window);

    self.playerSnake = new Snake(1, 1);
    self.playerSnake.addSegment(20);
    self.apple = new Apple(5, 5);

    var cycle = function() {
        self.inputManager.cycle(self.playerSnake);
        console.log("Cycle called");
        self.renderer.clear();
        self.renderer.drawGrid(40, 40);

        self.renderer.drawApple(self.apple);
        
        self.renderer.drawSnake(self.playerSnake);
        window.requestAnimationFrame(cycle);
    };

    self.start = function() {
        window.requestAnimationFrame(cycle);
    }
}

module.exports = Game;