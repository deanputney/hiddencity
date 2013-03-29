var camera, scene, renderer;
var geometry, material, mesh;

var COLORSETS = {
  RAINBOWBRITE: new Array('#71c8bf', '#1ba554', '#cad93b', '#fef02f', '#fbb62c', '#f38a2e', '#ee592c', '#ea1d2b', '#b42767', '#65328f', '#52529f', '#20aeda'),
  CMY: new Array('#FFE328', '#FF0E9B', '#20BECC'),
  CMYK: new Array(''),
  WHITE: new Array('#fff'),
};
    
COLORSETS.GREYSCALE = new Array();
for(x=1; x<=12; x++){
  color = '#'+zeroFill(parseInt(255-20*x).toString(16), 2)+zeroFill(parseInt(255-20*x).toString(16), 2)+zeroFill(parseInt(255-20*x).toString(16), 2);
  COLORSETS.GREYSCALE.push(color);
}
    
COLORSETS.BLUE = new Array();
for(x=1; x<=12; x++){
  color = '#'+zeroFill(parseInt(0).toString(16), 2)+zeroFill(parseInt(0).toString(16), 2)+zeroFill(parseInt(255-20*x).toString(16), 2);
  COLORSETS.BLUE.push(color);
}
    
COLORSETS.LIGHTBLUE = new Array();
for(x=1; x<=12; x++){
  color = '#'+zeroFill(parseInt(255-20*x).toString(16), 2)+zeroFill(parseInt(255-20*x).toString(16), 2)+zeroFill(parseInt(255-10*x).toString(16), 2);
  COLORSETS.LIGHTBLUE.push(color);
}   
 
COLORSETS.LIGHTCYAN = new Array();
for(x=1; x<=12; x++){
  color = '#'+zeroFill(parseInt(32+5*x).toString(16), 2)+zeroFill(parseInt(190+5*x).toString(16), 2)+zeroFill(parseInt(204).toString(16), 2);
  COLORSETS.LIGHTCYAN.push(color);
}
    
COLORSETS.LIGHTPINK = new Array();
for(x=1; x<=12; x++){
  color = '#'+zeroFill(parseInt(255).toString(16), 2)+zeroFill(parseInt(36+10*x).toString(16), 2)+zeroFill(parseInt(120+10*x).toString(16), 2);
  COLORSETS.LIGHTPINK.push(color);
}

COLORSETS.LIGHTGOLD = new Array();
for(x=1; x<=12; x++){
  color = '#'+zeroFill(parseInt(255).toString(16), 2)+zeroFill(parseInt(227).toString(16), 2)+zeroFill(parseInt(40+15*x).toString(16), 2);
  COLORSETS.LIGHTGOLD.push(color);
}
    
COLORSETS.UNRAINBOW = new Array();
for(x=0; x<12; x++){
  COLORSETS.UNRAINBOW[x] = Colors.complement(COLORSETS.RAINBOWBRITE[x]);
}
    
COLORSETS.RAINBOW = new Array();
for(i=1; i<=12; i++){
  console.log(i);
  color = Colors.rgb2hex(Colors.hsv2rgb([i*25, 90, 100]).a);
  console.log(i);
  console.log(color);
  COLORSETS.RAINBOW.push(color);
}

COLORSET = {
  CURRENT: COLORSETS.WHITE,
  INDEX: 0,
  COLOR: function(){
    return this.CURRENT[this.INDEX];
  },
  NEXT: function(){
    if(this.INDEX+1 < this.CURRENT.length)
      this.INDEX = this.INDEX+1;
    else
      this.INDEX = 0;
  },
  PREVIOUS: function(){
    if(this.INDEX-1 >= 0)
      this.INDEX = this.INDEX-1;
    else
      this.INDEX = this.CURRENT.length-1;
  }
}

StandardObjects = [
	{ 
		name: "sphere", 
		create: function () { return new THREE.SphereGeometry( 75, 20, 10 ) }
	},
	
	{ 
		name: "icos", 
		create: function () { return new THREE.IcosahedronGeometry( 75, 1 ) }
	},
	
	{ 
		name: "octo", 
		create: function () { return new THREE.OctahedronGeometry( 75, 2 ) }
	},

	{ 
		name: "tetra", 
		create: function () { return new THREE.TetrahedronGeometry( 75, 0 ) }
	},
	
	{ 
		name: "octo", 
		create: function () { return new THREE.OctahedronGeometry( 75, 2 ) }
	},
	
	{ 
		name: "cube", 
		create: function () { return new THREE.CubeGeometry( 100, 100, 100, 4, 4, 4 ) }
	},
	
	{ 
		name: "cylinder", 
		create: function () { return new THREE.CylinderGeometry( 25, 75, 100, 40, 5 ) }
	},
	
	{ 
		name: "torus", 
		create: function () { return new THREE.TorusGeometry( 50, 20, 20, 20 ) }
	}
	
]

function zeroFill( number, width ){
  width -= number.toString().length;
  if (width>0){
    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
  }
  return number + ""; // always return a string
}
