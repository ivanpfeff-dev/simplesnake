var Snake = require('./snake');
var KeyState = require('./keystate');

function InputManager(window) {
    var keyState = new KeyState(window);

    this.cycle = function(playerSnake) {
        var direction = keyState.getDirection();
        if(direction){
          playerSnake.turn(direction);
        }
    };
};

module.exports = InputManager;