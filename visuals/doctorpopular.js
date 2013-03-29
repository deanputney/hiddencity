var DoctorPopular = function(){
  this.BACKGROUND = {
    default: '#000000',
    // colorset: COLORSETS.MINUSBABY.slice(0),
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
  this.BACKGROUND.color = this.BACKGROUND.default;
  
  this.SKYBOX = {
    objects: [],
    init: function(){
    	var materialArray = [];
      console.log('loading');
      
			video = document.getElementById( 'img1' );
      video.src = 'visuals/doctorpopular/defenestration.gif';
			texture = new THREE.Texture( video );
			texture.minFilter = THREE.LinearFilter;
			texture.magFilter = THREE.LinearFilter;
			texture.format = THREE.RGBFormat;
			texture.generateMipmaps = false;
      
    	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'visuals/doctorpopular/defenestration.gif' ) }));
    	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'visuals/doctorpopular/defenestration.gif' ) }));
    	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'visuals/doctorpopular/defenestration.gif' ) }));
    	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'visuals/doctorpopular/defenestration.gif' ) }));
    	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'visuals/doctorpopular/defenestration.gif' ) }));
    	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'visuals/doctorpopular/defenestration.gif' ) }));

      console.log('loaded');
      
    	for (var i = 0; i < 6; i++)
    	   materialArray[i].side = THREE.BackSide;
    	var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );
	
    	var skyboxGeom = new THREE.CubeGeometry( 5000, 5000, 5000, 1, 1, 1 );
	
    	var skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial );
    	scene.add( skybox );	
    }
  };
  
  
  this.SHADERS = {
    objects: [],
    init: function(){
      // postprocessing
      composer = new THREE.EffectComposer( renderer );
      composer.addPass( new THREE.RenderPass( scene, camera ) );

      var dotScreenEffect = new THREE.ShaderPass( THREE.DotScreenShader );
      dotScreenEffect.uniforms[ 'scale' ].value = 4;
      composer.addPass( dotScreenEffect );

      this.rgbEffect = new THREE.ShaderPass( THREE.RGBShiftShader );
      rgbEffect.uniforms[ 'amount' ].value = 0.0015;
      rgbEffect.renderToScreen = true;
      composer.addPass( rgbEffect );
      
      return composer;
    },
  }
  
  
  this.init = function(){
    camera = new THREE.PerspectiveCamera( 10, window.innerWidth / window.innerHeight, 1, 100000 );
    camera.position.z = 90000;
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
                
    // BARS.init();
    this.SKYBOX.init();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    // composer = SHADERS.init();
    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( scene, camera ) );

    this.dotScreenEffect = new THREE.ShaderPass( THREE.DotScreenShader );
    this.dotScreenEffect.uniforms[ 'scale' ].value = 0;
    // composer.addPass( dotScreenEffect );

    this.rgbEffect = new THREE.ShaderPass( THREE.RGBShiftShader );
    this.rgbEffect.uniforms[ 'amount' ].value = 0;
    this.rgbEffect.renderToScreen = true;
    composer.addPass( this.rgbEffect );
    console.log('shaders initialized');

    document.body.appendChild( renderer.domElement );
    
    
    
    
    /* Gamepad binding */

    gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
      switch(e.control){
        case 'A':
          camera.translateZ(-Math.abs(camera.position.z)/5);
          break;
        case 'B':
          camera.translateZ(-Math.abs(camera.position.z)/3);
          break;
        case 'Y':
          if(game.rgbEffect.uniforms[ 'amount' ].value > 0){
            game.rgbEffect.uniforms[ 'amount' ].value = 0;
          }
          else{
            game.rgbEffect.uniforms[ 'amount' ].value = 0.03;
          }
          break;
        case 'X':
          game.rgbEffect.uniforms[ 'amount' ].value = 0.01;
          break;
        case 'DPAD_UP':
          game.ZFIGHTERS.rotation.speed += .005;
          break;
        case 'DPAD_DOWN':
          game.ZFIGHTERS.rotation.speed -= .005;
          break;
        case 'DPAD_RIGHT':
          camera.orbit.speed += 10;
          break;
        case 'DPAD_LEFT':
          camera.orbit.speed -= 10;
          break;
        case 'BACK':
          window.location = window.location;
          break;
        case 'START':
          game.ZFIGHTERS.rotation.speed = 0;
          game.ZFIGHTERS.objects[0].rotation.z = 0;
          game.ZFIGHTERS.objects[1].rotation.z = 0;
          break;
        case 'RB':
          game.ZFIGHTERS.objects[0].rotation.z = 0;
          game.ZFIGHTERS.objects[1].rotation.z = 0;
          break;
        case 'LB':
          camera.orbit.speed = 0;
          break;
      }
    });
		
    gamepad.bind(Gamepad.Event.BUTTON_UP, function(e) {
      switch(e.control){
        case 'A':
          camera.translateZ(Math.abs(camera.position.z)/4);
          break;
        case 'B':
          camera.translateZ(Math.abs(camera.position.z)/2);
          break;
        case 'Y':
          break;
        case 'X':
          game.rgbEffect.uniforms[ 'amount' ].value = 0;
          break;
        case 'RB':
          break;
        case 'LB':
          break;
      }
    });
  }
  
  this.animate = function() {            
    // note: three.js includes requestAnimationFrame shim
    // console.log(game.animate);
    // console.log(requestAnimationFrame);
    requestAnimationFrame( game.animate );

    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.02;
    // console.log(navigator.webkitGetGamepads()[0].buttons[0]);
    
    if(Math.abs(camera.orbit.speed) > 0) camera.orbit.step();
    
            
    if(navigator.webkitGetGamepads()[0]){          
      // if(Math.abs(navigator.webkitGetGamepads()[0].axes[0]) >= .2)
        // game.ZFIGHTERS.objects[0].position.x = navigator.webkitGetGamepads()[0].axes[0].toFixed(1)*100;
      if(Math.abs(navigator.webkitGetGamepads()[0].axes[1]) >= .1)
        camera.translateZ(Math.abs(navigator.webkitGetGamepads()[0].axes[1].toFixed(1))*navigator.webkitGetGamepads()[0].axes[1].toFixed(1)*500);
      if(Math.abs(navigator.webkitGetGamepads()[0].axes[2]) >= .2)
        game.ZFIGHTERS.objects[1].position.x = navigator.webkitGetGamepads()[0].axes[2].toFixed(1)/100;
      if(Math.abs(navigator.webkitGetGamepads()[0].axes[3]) >= .2)
        game.ZFIGHTERS.objects[1].position.y = navigator.webkitGetGamepads()[0].axes[3].toFixed(1)/100;
    }

    composer.render( );

  }

  this.init();
}