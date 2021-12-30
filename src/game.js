var Snake = require('./snake');
var Segment = require('./segment');
var Renderer = require('./renderer');
var Direction = require('./direction');
var InputManager = require('./inputManager');
var Apple = require('./apple');
const Grid = require('./grid');
const Point = require('./point');

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

    self.grid = new Grid(30, 30, 900);
    self.renderer = new Renderer();
    self.renderer.setCanvas(canvas);
    self.inputManager = new InputManager(window);

    self.playerSnake = new Snake(new Point(0, 10), Direction.RIGHT);
    self.playerSnake.addSegment(5);
    self.grid.addSnake(self.playerSnake, true);
    self.grid.addSnake(new Snake(new Point(15, 10), Direction.LEFT), false);
    self.grid.generateApple();
    self.grid.generateApple();
    self.grid.generateApple();
    self.grid.generateApple();
    self.grid.generateApple();
    
    var cycle = function() {
        self.inputManager.cycle(self.playerSnake);
        self.renderer.cycle(self.grid, self.grid.getSnakes(), self.grid.getApples(), self.playerSnake);
        self.grid.cycle();

        window.requestAnimationFrame(cycle);
    };

    self.start = function() {
        window.requestAnimationFrame(cycle);
    }
}

module.exports = Game;