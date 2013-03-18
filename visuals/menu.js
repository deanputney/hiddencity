var menu = { 
  init: function(){
    console.log('Binding menu gamepad controls');
    this.size = $('#menu li').length;
        
    /* Gamepad bindings */
		gamepad.bind(Gamepad.Event.CONNECTED, function(device) {
			console.log('Connected', device);

			$('#gamepads').append('<li id="gamepad-' + device.index + '"><h1>Gamepad #' + device.index + ': ' + device.id + ' (' + device.type + ')</h1></li>');
			
			var mainWrap = $('#gamepad-' + device.index),
				statesWrap,
				logWrap,
				control,
				value;
			
			mainWrap.append('<strong>State</strong><ul id="states-' + device.index + '"></ul>');
			mainWrap.append('<strong>Events</strong><ul id="log-' + device.index + '"></ul>');

			statesWrap = $('#states-' + device.index)
			logWrap = $('#log-' + device.index)

			for (control in device.state) {
				value = device.state[control];
				
				statesWrap.append('<li>' + control + ': <span id="state-' + device.index + '-' + control + '">' + value + '</span></li>');
			}
			
			$('#connect-notice').hide();
		});

		gamepad.bind(Gamepad.Event.DISCONNECTED, function(device) {
			console.log('Disconnected', device);
			
			$('#gamepad-' + device.index).remove();
			
			if (gamepad.count() == 0) {
				$('#connect-notice').show();
			}
		});
    
    gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
      console.log(e.control);
      switch(e.control){
        case 'DPAD_UP':
        console.log('previous');
          menu.previous();
          break;
        case 'DPAD_DOWN':
          menu.next();
          break;
        case 'A':
          menu.select();
          break;
      }
    });
    
    gamepad.bind(Gamepad.Event.BUTTON_UP, function(e) {
      console.log('button up');
    });
  },
  
  selected: 1,
  gameSelection: null,
  
  next: function(){
    $('#menu li:nth-child('+menu.selected+') span').removeClass('selected');
    menu.selected += 1;
    if(menu.selected > menu.size)
      menu.selected = 1;
    $('#menu li:nth-child('+menu.selected+') span').addClass('selected');
  },
  
  previous: function(){
    $('#menu li:nth-child('+menu.selected+') span').removeClass('selected');
    menu.selected -= 1;
    if(menu.selected < 1)
      menu.selected = menu.size;
    $('#menu li:nth-child('+menu.selected+') span').addClass('selected');
  },
  
  select: function(){
    switch($('#menu .selected').text().toLowerCase()){
      case 'br1ght pr1mate':
        menu.gameSelection = BrightPrimate;
        break;
      case 'minusbaby':
        menu.gameSelection = MinusBaby;
        break;
      default:
        return;
    }
    menu.indicateSelection();
  },
  
  indicateSelection: function(){
    $('.selected').addClass('flash');
    setTimeout("$('.selected').removeClass('flash');", 200);
    setTimeout("$('.selected').addClass('flash');", 400);
    setTimeout("$('.selected').removeClass('flash');", 600);
    setTimeout("menu.loadGame(menu.gameSelection);", 800);
  },
  
  loadGame: function(gameSelection){
    $('body').fadeOut(1000, function(){
      $('#menu').hide();
      gamepad.unbind(Gamepad.Event.BUTTON_DOWN);
      gamepad.unbind(Gamepad.Event.BUTTON_UP);
      
      var game = new gameSelection();
      $('body').fadeIn(1000);
    });
  }
}