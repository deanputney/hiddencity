var BrightPrimate = function(){
  this.BACKGROUND = {
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
  this.BACKGROUND.color = this.BACKGROUND.default;
  
  this.BARS = {
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
        geometry = new THREE.CubeGeometry( window.innerWidth/12, 1000000, window.innerWidth/12 );
    		material = new THREE.MeshBasicMaterial( { color: this.colorset[0], wireframe: false, wireframeLinewidth: 3, overdraw: true } );
            
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
      for(b in game.BARS.objects){ game.BARS.objects[b].material.wireframe = !this.wireframe; }
      this.wireframe = !this.wireframe;
    }
  };

  this.init = function() {

    camera = new THREE.PerspectiveCamera( 10, window.innerWidth / window.innerHeight, 1, 100000 );
    camera.position.z = 4500;
    camera.velocity = { x:0, y:0, z:0 };
    camera.rotational_velocity = { x:0, y:0 };
    camera.orbit = {
      speed: 0,
      step: function(){
        var distance = camera.position.distanceTo({x:0,y:0,z:0});
        camera.translateX(this.speed);
        camera.lookAt({x:0,y:0,z:0});
        camera.translateZ(camera.position.distanceTo({x:0,y:0,z:0})-distance);
      }
    };

    scene = new THREE.Scene();

    geometry = new THREE.CubeGeometry( 200, 200, 200 );
    material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: false, wireframeLinewidth: 5, overdraw: true } );

    mesh = new THREE.Mesh( geometry, material );
    mesh.geometry.dynamic = true;
    mesh.geometry.__dirtyVertices = true;
    mesh.geometry.__dirtyNormals = true;
    // scene.add( mesh );
            
    this.BARS.init();
            
    // var planeW = 50; // pixels
    // var planeH = 50; // pixels 
    // var numW = 50; // how many wide (50*50 = 2500 pixels wide)
    // var numH = 50; // how many tall (50*50 = 2500 pixels tall)
    // var plane = new THREE.Mesh( new THREE.PlaneGeometry( planeW*50, planeH*50, planeW, planeH ), new   THREE.MeshBasicMaterial( { color: 0xFFFFFF, wireframe: true } ) );
    // scene.add(plane);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    // composer = SHADERS.init();
    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( scene, camera ) );

    // var dotScreenEffect = new THREE.ShaderPass( THREE.DotScreenShader );
    // dotScreenEffect.uniforms[ 'scale' ].value = 0;
    // composer.addPass( dotScreenEffect );

    var rgbEffect = new THREE.ShaderPass( THREE.RGBShiftShader );
    rgbEffect.uniforms[ 'amount' ].value = 0;
    rgbEffect.renderToScreen = true;
    composer.addPass( rgbEffect );
    console.log('shaders initialized');

    document.body.appendChild( renderer.domElement );
    
    /* Gamepad binding */
    
    console.log('binding down');
    gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
      switch(e.control){
        case 'Y':
          game.BARS.toggleWireframe();
          break;
        case 'X':
          game.BARS.toggleWireframe();
          break;
        case 'B':
          console.log('color shift');
          game.BARS.colorset.push(game.BARS.colorset.shift());
          for(var xpos = 0; xpos < 12; xpos++ ){
            game.BARS.objects[xpos].material =  new THREE.MeshBasicMaterial( { color: game.BARS.colorset[xpos], wireframe: false, wireframeLinewidth: 3, overdraw: true } );
          }
          break;
        case 'BACK':
          window.location = window.location;
          break;
      }
    });
		
    gamepad.bind(Gamepad.Event.BUTTON_UP, function(e) {
      switch(e.control){
        case 'X':
          game.BARS.toggleWireframe();
          break;
        case 'RB':
          for(b in game.BARS.objects) {
            game.BARS.objects[b].rotation.x += b/game.BARS.objects.length;
          }
          break;
        case 'LB':
          for(b in game.BARS.objects) {
            game.BARS.objects[b].rotation.x -= b/game.BARS.objects.length;
          }
          break;
        case 'DPAD_UP':
          game.BARS.rotation.speed += 0.01;
          break;
        case 'DPAD_DOWN':
          game.BARS.rotation.speed -= 0.01;
          break;
        case 'DPAD_RIGHT':
          camera.orbit.speed += 10;
          break;
        case 'DPAD_LEFT':
          camera.orbit.speed -= 10;
          break;
      }
    });
    
    $(document).bind('keydown', 'p', function(){game.BACKGROUND.togglePulse();});
    $(document).bind('keydown', 'o', function(){game.BARS.toggleWireframe();});
    $(document).bind('keydown', 'l', function(){
      for(b in game.BARS.objects) {
          game.BARS.objects[b].rotation.x += b/game.BARS.objects.length;
        }
      });
    $(document).bind('keydown', 'j', function(){game.BARS.rotation.speed += 0.01;});
    $(document).bind('keydown', 'k', function(){game.BARS.rotation.speed -= 0.01;});
    $(document).bind('keydown', 'e', function(){camera.lookAt({x:0,y:0,z:0})});
    $(document).bind('keydown', 'w', function(){camera.translateZ(-500);});
    $(document).bind('keydown', 's', function(){camera.translateZ(500);});
  }

  this.animate = function() {            
            
    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame( game.animate );

    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.02;
    // console.log(navigator.webkitGetGamepads()[0].buttons[0]);
    for(b in game.BARS.objects){
      game.BARS.objects[b].rotation.x += game.BARS.rotation.speed;
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
    
    if(Math.abs(camera.orbit.speed) > 0) camera.orbit.step();

    composer.render( );

  }

  this.init();
}