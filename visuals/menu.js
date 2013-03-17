var menu = { 
  init: function(){
    console.log('Binding menu gamepad controls');
    this.size = $('#menu li').length;
        
    /* Gamepad bindings */
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
      
    });
  },
  
  selected: 1,
  
  next: function(){
    console.log(menu.selected);
    console.log($('#menu li:nth-child('+menu.selected+') span'));
    $('#menu li:nth-child('+menu.selected+') span').removeClass('selected');
    menu.selected += 1;
    console.log(menu.selected);
    if(menu.selected > menu.size)
      menu.selected = 1;
    $('#menu li:nth-child('+menu.selected+') span').addClass('selected');
  },
  
  previous: function(){
    console.log(menu.selected);
    console.log($('#menu li:nth-child('+menu.selected+') span'));
    $('#menu li:nth-child('+menu.selected+') span').removeClass('selected');
    menu.selected -= 1;
    console.log(menu.selected);
    if(menu.selected < 1)
      menu.selected = menu.size;
    $('#menu li:nth-child('+menu.selected+') span').addClass('selected');
  },
  
  select: function(){
    $('#menu').fadeOut();
  },
}