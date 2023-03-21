var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 )

var posX;
var posY;
var rect1
var clientX

// var canvas = document.getElementById("renderCanvas");
// var canvasContainer = document.getElementById("canvas-container")

var textureWidth = 1024
var textureHeight = 1024
var mouse = new THREE.Vector2(0,0)
var raycaster = new THREE.Raycaster();

var renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )
window.addEventListener( 'resize', onWindowResize, false )	
window.addEventListener( 'mousemove', onMouseMove, false );

var fabricCanvas = new fabric.Canvas('paintCanvas', {
	backgroundColor: 'white',
	width: textureWidth,
	height: textureHeight,
})

var text = new fabric.IText('Three.js\n+\nFaBric.js', {
	fontSize: 40,
	textAlign: 'center',
	fontWeight: 'bold',
	left: 128,
	top: 128,
	angle: 30,
	originX: 'center',
	originY: 'center',
	styles: {
	  0: {
		0: {
		  fontSize: 60,
		  fontFamily: 'Impact',
		  fontWeight: 'normal',
		  fill: 'orange'
		}
	  },
	  1: {
		0: {
		  fill: "blue"
		}
	  },
	  2: {
		0: {
		  textBackgroundColor: 'red'
		},
		2: {
		  fill: 'fuchsia',
		  stroke: 'orange',
		  strokeWidth: 1
		}
	  }
	}
})
text.setSelectionStyles({
fontStyle: 'italic',
fill: '',
stroke: 'red',
strokeWidth: 2
}, 1, 5)
fabricCanvas.add(text)
// fabricCanvas.setActiveObject(text)

var paintCanvas = document.getElementById("paintCanvas");

var groundTexture = new THREE.CanvasTexture(paintCanvas)
groundTexture.wrapS = THREE.RepeatWrapping
groundTexture.wrapT = THREE.RepeatWrapping

var geometry = new THREE.PlaneGeometry(5, 5)
var material = new THREE.MeshBasicMaterial({
	map: groundTexture
})
var cube = new THREE.Mesh( geometry, material )
scene.add(cube)
// cube.rotation.y = 90
camera.position.set(0,0,3)

fabricCanvas.renderAll();

fabricCanvas.on("after:render", function() {
	cube.material.map.needsUpdate = true
})
fabricCanvas.on('mouse:down', function () {
    fabricCanvas.off('mouse:move', eventHandler);
});

var onPointer = function (event) {
	event.stopPropagation();
	var e = getEvent(event.type.replace("pointer", "mouse"), event);
	// console.log(e);
	if (e != null) {
		fabricCanvas.upperCanvasEl.dispatchEvent(e);
	}
	
	// Set current cursor used by fabricjs
	// renderCanvas.style.cursor = fabricCanvas.upperCanvasEl.style.cursor;
	// Important for Internet Explorer!
	return false;
};

// Get Converted Event by name
var getEvent = function (name, event) {

	// update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects( scene.children );

	var texcoords = null

	if(intersects.length>0){
		texcoords = intersects[0].uv;
	}
	
	if (texcoords) {
		
		var clicked_x = texcoords.x;
		var clicked_y = texcoords.y;

		posX = (clicked_x * textureWidth ) | 0;
		posY = (textureWidth - clicked_y * textureHeight ) | 0;

		rect1 = fabricCanvas.upperCanvasEl.getBoundingClientRect();

		clientX = posX + rect1.left | 0;
		clientY = posY + rect1.top | 0;

		// console.log(clientX + " " + clientY)

		// Doesn't matter
		var screenX = 0;//clientX;// - $(window).scrollLeft();
		var screenY = 0;//clientY;// - $(window).scrollTop();

		var evt = document.createEvent("MouseEvents");
		// debugger
		// console.log(clientX)
		evt.initMouseEvent(name, true, true, window, 1, screenX, screenY, clientX, clientY, event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, event.button, window.upperCanvasEl);

		return evt;

	}
	else {
	}
	return null;
}



function onWindowResize() {

	let width = window.innerWidth || 1
	let height = window.innerHeight || 1
	camera.aspect = width / height
	camera.updateProjectionMatrix()
	renderer.setSize( width, height )
}

var render = function () {
	requestAnimationFrame( render )
	renderer.render( scene, camera )
	// if(fabricCanvas.getActiveObject()!=undefined)
	// 		console.log(fabricCanvas.getActiveObject().left)
	// orbitController.update()
}

function onMouseMove(  event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

window.addEventListener("pointerdown", onPointer, false);
window.addEventListener("pointerup", onPointer, false);
window.addEventListener("pointermove", onPointer, false);

scene.onDispose = function () {
	window.removeEventListener("pointerdown", onPointer);
	window.removeEventListener("pointerup", onPointer);
	window.removeEventListener("pointermove", onPointer);
};

render()