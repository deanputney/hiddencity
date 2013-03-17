var camera, scene, renderer;
var geometry, material, mesh;
var COLORSETS = {
  RAINBOWBRITE: new Array('#71c8bf', '#1ba554', '#cad93b', '#fef02f', '#fbb62c', '#f38a2e', '#ee592c', '#ea1d2b', '#b42767', '#65328f', '#52529f', '#20aeda'),
  CMY: new Array('#FFE328', '#FF0E9B', '#20BECC'),
  CMYK: new Array(''),
  WHITE: new Array('#fff'),
};
        
var BACKGROUND = {
  default: '#000000',
  colorset: COLORSETS.RAINBOWBRITE.slice(0),
  togglePulse: function(){
    if(this.color == this.default){
      $('body').css('background', this.colorset[0]);
      this.color = this.colorset[0];
      this.colorset.push(this.colorset.shift());
    }
    else {
      $('body').css('background', this.default);
      this.color = this.default;
    }
    return this.color;
  },
};
BACKGROUND.color = BACKGROUND.default;

$(document).ready(function(){
  var gamepad = new Gamepad();
          
	if (!gamepad.init()) {
		alert('Your browser does not support gamepads, get the latest Google Chrome or Firefox.');
	}
});