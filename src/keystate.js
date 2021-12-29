var Direction = require('./direction');

function KeyState(window) {
  var isUp = false;
  var isDown	= false;
  var isLeft = false;
  var isRight = false;
	
  this.processUpEvent = function(keyEvent) {
    var key = keyEvent.key;
    if (key == 'ArrowUp')
     isUp = false;
    else if (key == 'ArrowDown') 
     isDown = false;
    else if (key == 'ArrowLeft')
     isLeft = false;
    else if (key == 'ArrowRight') 
     isRight = false;
  };
	
  this.processDownEvent = function(keyEvent) {
    var key = keyEvent.key;
    if (key == 'ArrowUp')
     isUp = true;
    else if (key == 'ArrowDown') 
     isDown = true;
    else if (key == 'ArrowLeft')
     isLeft = true;
    else if (key == 'ArrowRight') 
     isRight = true;
  };
	
  this.getDirection = function() {
    if (isUp)
     return Direction.UP;
    if (isDown) 
     return Direction.DOWN;
    if (isLeft)
     return Direction.LEFT;
    if (isRight) 
     return Direction.RIGHT;
     
     return null;
  };

  window.onkeyup = this.processUpEvent;
  window.onkeydown = this.processDownEvent;
}

module.exports = KeyState;