window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var WIDTH = 800,
	HEIGHT = 800;
	
var VIEW_ANGLE = 45,
	ASPECT = WIDTH/HEIGHT,
	NEAR = 0.1,
	FAR = 10000;	

var renderer = new THREE.WebGLRenderer();

renderer.setSize(WIDTH,HEIGHT);

var scene = new THREE.Scene();		

function createCamera()
{
	var camera = new THREE.PerspectiveCamera(
						VIEW_ANGLE,
						ASPECT,
						NEAR,
						FAR
					);
	camera.position.z = 300;
	return camera;
}


function createSphere(sphereMaterial)
{
	var radius = 50, segments = 16, rings = 16;
	var sphere = new THREE.Mesh(
			new THREE.SphereGeometry(radius,
			segments,
			rings),
			sphereMaterial);
	return sphere;
}

var light = new THREE.PointLight ( 0xFFFFFF );
light.position.x = 10;
light.position.y = 50;
light.position.z = 130;

var camera = createCamera();
var uniforms;

function main()
{
	var $container = $('#main');
	$container.append(renderer.domElement);	
	
	renderer.domElement.onmousemove = function() {
		light.position.x = window.event.clientX- WIDTH/2;
		light.position.y = HEIGHT/2 - window.event.clientY;
	};
	
	var	sphereMaterial = new THREE.MeshLambertMaterial(
	{
		color: 0xCC0000
	});
	
	var attributes = {
		displacement: {
			type: 'f', // a float
			value: [] // an empty array
		}
	};
	  
	  // add a uniform for the amplitude
	uniforms = {
		amplitude: {
			type: 'f', // a float
			value: 0
		}
	};
	// create the material and now
	// include the attributes property
	var shaderMaterial = new THREE.ShaderMaterial({
		uniforms:		uniforms,
		attributes:     attributes,
		vertexShader:   $('#vertexshader').text(),
		fragmentShader: $('#fragmentshader').text()
	});
	
	var sphere = createSphere(shaderMaterial)
	
	// now populate the array of attributes
	var vertices = sphere.geometry.vertices;
	var values = attributes.displacement.value
	for(var v = 0; v < vertices.length; v++) {
		values.push(Math.random() * 30);
	}
	
	scene.add(sphere);
	scene.add(light);	
	
	renderLoop();
}

function mouseMoveHandler()
{
	light.position.x = window.event.clientX;
	light.position.y = window.event.clientY;
}

var frame = 0;
function renderLoop()
{
	uniforms.amplitude.value = Math.sin(frame);
	frame += 0.1;
	renderer.render(scene, camera);
	requestAnimFrame(renderLoop);
}

$(document).ready(function () { main(); });