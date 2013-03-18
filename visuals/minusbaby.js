var MinusBaby = function(){
  COLORSETS.MINUSBABY = new Array('#00b9f1', '#FF0E9B', '#20BECC');
  var BACKGROUND = {
    default: '#000000',
    colorset: COLORSETS.MINUSBABY.slice(0),
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
  
  
  
  
  
  
  /* Gamepad binding */

  gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
    switch(e.control){
      case 'A':
        BACKGROUND.togglePulse();
        break;
      case 'Y':
        BARS.toggleWireframe();
        break;
    }
  });
		
  gamepad.bind(Gamepad.Event.BUTTON_UP, function(e) {
    switch(e.control){
      case 'A':
        BACKGROUND.togglePulse();
        break;
      case 'Y':
        BARS.toggleWireframe();
        break;
      case 'RB':
        for(b in BARS.objects) {
          BARS.objects[b].rotation.x += b/BARS.objects.length;
        }
        break;
      case 'LB':
        BARS.rotation.speed += 0.01;
    }
  });
}