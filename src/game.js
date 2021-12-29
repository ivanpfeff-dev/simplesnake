var Snake = require('./snake');
var Segment = require('./segment');
var Renderer = require('./renderer');
const Direction = require('./direction');

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

    var cycle = function() {
        console.log("Cycle called");
        self.renderer.clear();
        self.renderer.drawGrid(40, 40);
        var snake1 = new Snake(2,2);
        snake1.addSegment();
        self.renderer.drawSnake(snake1);
        window.requestAnimationFrame(cycle);
    };

    self.start = function() {
        window.requestAnimationFrame(cycle);
    }
}

module.exports = Game;