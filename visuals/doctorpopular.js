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
    camera.position.z = 2500;
    camera.velocity = { x:0, y:0, z:0 };
    camera.rotational_velocity = { x:0, y:0 };
    camera.lookAt({x:0,y:0,z:0});
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
    
    // create the video element
    	video = document.createElement( 'video' );
    	// video.id = 'video';
    	// video.type = ' video/ogg; codecs="theora, vorbis" ';
    	video.src = "visuals/doctorpopular/defenestration.mp4";
      video.loop = 'true';
    	video.load(); // must call after setting/changing source
    	video.play();
	
    	// alternative method -- 
    	// create DIV in HTML:
    	// <video id="myVideo" autoplay style="display:none">
    	//		<source src="videos/sintel.ogv" type='video/ogg; codecs="theora, vorbis"'>
    	// </video>
    	// and set JS variable:
    	// video = document.getElementById( 'myVideo' );
	
    	videoImage = document.createElement( 'canvas' );
    	videoImage.width = window.innerWidth;
    	videoImage.height = window.innerHeight;

    	videoImageContext = videoImage.getContext( '2d' );
    	// background color if no video present
    	videoImageContext.fillStyle = '#000000';
    	videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

    	videoTexture = new THREE.Texture( videoImage );
    	videoTexture.minFilter = THREE.LinearFilter;
    	videoTexture.magFilter = THREE.LinearFilter;
	
    	var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
    	// the geometry on which the movie will be displayed;
    	// 		movie image will be scaled to fit these dimensions.
    	var movieGeometry = new THREE.PlaneGeometry( 200, 200, 4, 4 );
    	 movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
    	movieScreen.position.set(0,0,0);
    	scene.add(movieScreen);
      
      
      
      
      var planeW = 50; // pixels
      var planeH = 50; // pixels 
      var numW = 50; // how many wide (50*50 = 2500 pixels wide)
      var numH = 50; // how many tall (50*50 = 2500 pixels tall)
      var plane = new THREE.Mesh( new THREE.PlaneGeometry( planeW*50, planeH*50, planeW, planeH ), new   THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true, wireframeLinewidth: 5, overdraw: true } ) );
      scene.add(plane);
      plane.position.z += .01;
      
      geometry = new THREE.CubeGeometry( window.innerWidth, window.innerHeight, .01 );
  		material = new THREE.MeshBasicMaterial( { color: '#fff', wireframe: false, wireframeLinewidth: 3, overdraw: true } );
          
      // bar = new THREE.Mesh( geometry, material );
      // scene.add(bar);
      // this.objects.push(bar);
      
      var plane = new THREE.Mesh( new THREE.PlaneGeometry( planeW*50, planeH*50, planeW, planeH ), new   THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true, wireframeLinewidth: 5, overdraw: true } ) );
      scene.add(plane);
    
      
      

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
  	if ( video.readyState === video.HAVE_ENOUGH_DATA ) 
  	{
  		videoImageContext.drawImage( video, 0, 0 );
  		if ( videoTexture ) 
  			videoTexture.needsUpdate = true;
  	}
    
            
    if(navigator.webkitGetGamepads()[0]){          
      // if(Math.abs(navigator.webkitGetGamepads()[0].axes[0]) >= .2)
        // game.ZFIGHTERS.objects[0].position.x = navigator.webkitGetGamepads()[0].axes[0].toFixed(1)*100;
      if(Math.abs(navigator.webkitGetGamepads()[0].axes[1]) >= .1)
        camera.translateZ(Math.abs(navigator.webkitGetGamepads()[0].axes[1].toFixed(1))*navigator.webkitGetGamepads()[0].axes[1].toFixed(1)*500);
      // if(Math.abs(navigator.webkitGetGamepads()[0].axes[2]) >= .2)
      //   game.ZFIGHTERS.objects[1].position.x = navigator.webkitGetGamepads()[0].axes[2].toFixed(1)/100;
      // if(Math.abs(navigator.webkitGetGamepads()[0].axes[3]) >= .2)
      //   game.ZFIGHTERS.objects[1].position.y = navigator.webkitGetGamepads()[0].axes[3].toFixed(1)/100;
    }
    
    renderer.clear();
    composer.render( );

  }

  this.init();
}