var BrightPrimate = function(){
  var BACKGROUND = {
    default: '#000000',
    colorset: COLORSETS.RAINBOWBRITE.slice(0),
    togglePulse: function(){
      console.log('pulse');
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
  
  var BARS = {
    rotation: { 
      speed: 0, 
      quantity: 0 
    },
    colorset: COLORSETS.RAINBOWBRITE.slice(0),
    wireframe: false,
    objects: [],
    init: function(){
      var bar, material;
      for(var xpos = 0; xpos < 12; xpos++ ){
        geometry = new THREE.CubeGeometry( window.innerWidth/12, window.innerHeight, window.innerWidth/12 );
    		material = new THREE.MeshBasicMaterial( { color: BARS.colorset[0], wireframe: false, wireframeLinewidth: 3, overdraw: true } );
            
        bar = new THREE.Mesh( geometry, material );
            
        bar.position.x = window.innerWidth/12*xpos-window.innerWidth/2+window.innerWidth/12/2;
        // bar.rotation.x = 1/12*xpos;
        this.colorset.push(this.colorset.shift());
        scene.add(bar);
        this.objects.push(bar);
      }
      this.rotateColors();
    },
    rotateColors: function(){
      for(b in this.objects){
        this.objects[b].material.color = new THREE.Color(COLORSETS.RAINBOWBRITE[0]);
        COLORSETS.RAINBOWBRITE.push(COLORSETS.RAINBOWBRITE.shift());
      }
      COLORSETS.RAINBOWBRITE.push(COLORSETS.RAINBOWBRITE.shift());
      // setTimeout('rotateVerticalBarsColors();', 500);
    },
    toggleWireframe: function(){
      console.log('wireframe'+Date());
      for(b in BARS.objects){ BARS.objects[b].material.wireframe = !this.wireframe; }
      this.wireframe = !this.wireframe;
    }
  };

  init = function() {

    camera = new THREE.PerspectiveCamera( 10, window.innerWidth / window.innerHeight, 1, 100000 );
    camera.position.z = 4500;
    camera.velocity = { x:0, y:0, z:0 };
    camera.rotational_velocity = { x:0, y:0 };

    scene = new THREE.Scene();

    geometry = new THREE.CubeGeometry( 200, 200, 200 );
    material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: false, wireframeLinewidth: 5, overdraw: true } );

    mesh = new THREE.Mesh( geometry, material );
    mesh.geometry.dynamic = true;
    mesh.geometry.__dirtyVertices = true;
    mesh.geometry.__dirtyNormals = true;
    // scene.add( mesh );
            
    BARS.init();
            
    var planeW = 50; // pixels
    var planeH = 50; // pixels 
    var numW = 50; // how many wide (50*50 = 2500 pixels wide)
    var numH = 50; // how many tall (50*50 = 2500 pixels tall)
    var plane = new THREE.Mesh( new THREE.PlaneGeometry( planeW*50, planeH*50, planeW, planeH ), new   THREE.MeshBasicMaterial( { color: 0xFFFFFF, wireframe: true } ) );
    scene.add(plane);

    renderer = new THREE.CanvasRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );
    
    /* Gamepad binding */
    
    console.log('binding down');
    gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
    	$('#log-' + e.gamepad.index).append('<li>' + e.control + ' [' + e.mapping + '] down</li>');
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

  animate = function() {            
            
    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame( animate );

    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.02;
    // console.log(navigator.webkitGetGamepads()[0].buttons[0]);
    for(b in BARS.objects){
      BARS.objects[b].rotation.x += BARS.rotation.speed;
    }
            
    if(navigator.webkitGetGamepads()[0]){          
      if(Math.abs(navigator.webkitGetGamepads()[0].axes[0]) >= .2)
        camera.translateX(navigator.webkitGetGamepads()[0].axes[0].toFixed(1)*10)
      if(Math.abs(navigator.webkitGetGamepads()[0].axes[1]) >= .2)
        camera.translateZ(navigator.webkitGetGamepads()[0].axes[1].toFixed(1)*100);
      if(Math.abs(navigator.webkitGetGamepads()[0].axes[2]) >= .2)
        camera.rotation.y += -navigator.webkitGetGamepads()[0].axes[2].toFixed(1)/100;
      if(Math.abs(navigator.webkitGetGamepads()[0].axes[3]) >= .2)
        camera.rotation.x += -navigator.webkitGetGamepads()[0].axes[3].toFixed(1)/100;
    }

    renderer.render( scene, camera );

  }

  init();
  animate();
}