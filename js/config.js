import * as THREE from './libs/three.module.js';
 import { GLTFLoader } from './libs/GLTFLoader.js';
import {OrbitControls} from './libs/OrbitControls.js';
// import {onWindowResize} from './resize.js'
let init, modelLoad;
let gltfpath = "assets/path.glb";
let texLoader = new THREE.TextureLoader();
let arrayObjects = [];
let raycaster = new THREE.Raycaster(),mouse = new THREE.Vector2(),SELECTED;
let canvasOne,rect,onClickPosition = new THREE.Vector2();;
let posX,posY,rect1,clientX,clientY;
$(document).ready(function () {
    let detect = detectWebGL();
    if (detect == 1) {
        canvasOne = this.__canvas = new fabric.Canvas('fabCan',{backgroundColor:'#ebf2ff',height:512,width:512 });
        initFab();
        console.log(canvasOne);
        init = new sceneSetup(70, 1, 1000, 0, 0, 7);
        modelLoad = new objLoad();
        // modelLoad.Model();
        // init.renderer.domElement.addEventListener('pointerdown', onDocumentMouseDown, true);
        // init.planeObj.material.map = new THREE.Texture(canvasOne); 
        // init.planeObj.material.map.needsUpdate = true;
       
        let paintCanvas = document.getElementById("fabCan");
        let groundTexture = new THREE.CanvasTexture(paintCanvas)
        // groundTexture.
        groundTexture.wrapS = THREE.RepeatWrapping
        groundTexture.wrapT = THREE.RepeatWrapping

        // init.planeObj.material.map = groundTexture;
        // init.planeObj.material.map.needsUpdate = true;
        

        let geometry = new THREE.PlaneGeometry(5, 5)
        let material = new THREE.MeshBasicMaterial({
            map: groundTexture,
            side: THREE.DoubleSide
        })
        let plane = new THREE.Mesh( geometry, material )
        plane.name = 'Plane'
        init.scene.add(plane)
        arrayObjects.push(plane);
        // setInterval(function(){
            // init.planeObj.material.map = groundTexture;
            // init.planeObj.material.map.needsUpdate = true;
            // console.log('hi');
        // },500)
        canvasOne.on("after:render", function() {
            plane.material.map.needsUpdate = true
        })
       /* canvasOne.on('mouse:down',function(option){
            // console.log(option.e.x,option.e.y);
            //if(canvas.containsPoint(option.e,rect)) console.log('inside rect');
            var objects = canvasOne.getObjects();
            // console.log('objects-->',objects);
            // objects.forEach(element => {
                if(rect.containsPoint(option.e)){
                    console.log('inside rect')  
                } else{
                    console.log('NO....');
                }
            // });
           })*/
        // canvasOne.on('mouse:down', function () {
        //     canvasOne.off('mouse:move', eventHandler);
        // });
        init.renderer.domElement.addEventListener("pointerdown", getEvent, false);
        // window.addEventListener("pointerup", onPointer, false);
        // window.addEventListener("pointermove", onPointer, false);

        // window.addEventListener( 'mousemove', onMouseMove, false );
       
    } else if (detect == 0) {
        alert("PLEASE ENABLE WEBGL IN YOUR BROWSER....");
    } else if (detect == -1) {
        alert(detect);
        alert("YOUR BROWSER DOESNT SUPPORT WEBGL.....");
    }
});
function detectWebGL() {
    // Check for the WebGL rendering context
    if (!!window.WebGLRenderingContext) {
        var canvas = document.createElement("canvas"),
            names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
            context = false;

        for (var i in names) {
            try {
                context = canvas.getContext(names[i]);
                if (context && typeof context.getParameter === "function") {
                    // WebGL is enabled.
                    return 1;
                }
            } catch (e) { }
        }

        // WebGL is supported, but disabled.
        return 0;
    }

    // WebGL not supported.
    return -1;
};
let material = {
    cube: new THREE.MeshLambertMaterial({
        //   map:THREE.ImageUtils.loadTexture("assets/Road texture.png"),
        color: 0xffffff,
        combine: THREE.MixOperation,
        side: THREE.DoubleSide
    }),
}
function initFab(){
     rect = new fabric.Rect({
        width: 100,
        height: 100,
        fill: '#eb49e8',
        stroke: 'green',
        strokeWidth: 3,
        // originX:'center'
    });
    canvasOne.add(rect);
    canvasOne.centerObject(rect);
    // let rectOne = new fabric.Rect({
    //     width: 200,
    //     height: 100,
    //     fill: 'red',
    //     stroke: 'green',
    //     strokeWidth: 3,
    //     // originX:'center'
    // });
    // canvasOne.add(rectOne);
    // // canvasOne.centerObject(rectOne);
    
}
class sceneSetup {
    constructor(FOV, near, far, x, y, z, ambientColor) {
        this.container = document.getElementById("canvas");
        this.scene = new THREE.Scene();
        // this.addPrimitives();
        this.camera(FOV, near, far, x, y, z);
        this.ambientLight(ambientColor);
        this.render();

    }
    camera(FOV, near, far, x, y, z) {
        this.cameraMain = new THREE.PerspectiveCamera(FOV, this.container.offsetWidth / this.container.offsetHeight, near, far);
        this.cameraMain.position.set(x, y, z);
        // this.cameraMain.lookAt(this.camPoint);
        this.cameraMain.lookAt(0, 0, 0);
        this.scene.add(this.cameraMain);
        this.rendering();
    }
    rendering() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setClearColor(0xdbdbdb);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.container.appendChild(this.renderer.domElement);
        this.controls = new OrbitControls(this.cameraMain, this.renderer.domElement);
      
        // this.controls.minDistance = 100;
        // this.controls.maxDistance = 300;
        // this.controls.maxPolarAngle = Math.PI / 2 * 115 / 120;
        // this.controls.minPolarAngle = 140 / 120;
        // this.controls.minAzimuthAngle = -280 / 120;
        // this.controls.maxAzimuthAngle = -115 / 120;
    }
    addPrimitives() {
        // this.geo = new THREE.BoxBufferGeometry(1, 1, 1);
        // this.mat = material.cube;
        // this.camPoint = new THREE.Mesh(this.geo, this.mat);
        // this.camPoint.name = 'Cube';
        // this.scene.add(this.camPoint);
        // this.camPoint.position.set(0, 0, 0);
        // arrayObjects.push(this.camPoint);

        this.planeGeo = new THREE.PlaneGeometry( 7, 7);
        this.planeMat = new THREE.MeshLambertMaterial( { side: THREE.DoubleSide} );
        this.planeObj = new THREE.Mesh(  this.planeGeo , this.planeMat  );
        this.planeObj.name = 'plane';
        this.scene.add( this.planeObj );
        arrayObjects.push(this.planeObj);
    }
    ambientLight(ambientColor) {
        this.ambiLight = new THREE.AmbientLight(0xffffff);
        this.light = new THREE.HemisphereLight(0xd1d1d1, 0x080820, 1);
        this.scene.add(this.ambiLight);
    }
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        // this.controls.update();
        this.renderer.render(this.scene, this.cameraMain);
    }
    render() {
        this.animate();
    }
}

const onWindowResize=()=> {
    init.cameraMain.aspect = init.container.offsetWidth / init.container.offsetHeight;
    init.renderer.setSize(init.container.offsetWidth, init.container.offsetHeight);
    init.cameraMain.updateProjectionMatrix();
}

window.addEventListener('resize', onWindowResize, false);


/*
const onDocumentMouseDown = (event) => {
    event.preventDefault();
    const rect = init.renderer.domElement.getBoundingClientRect();        
    mouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
    mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
    raycaster.setFromCamera( mouse, init.cameraMain );
    let intersects = raycaster.intersectObjects( arrayObjects,true );
    let texcoords = null;
    if ( intersects.length > 0 ) {	 
        SELECTED = intersects[ 0 ].object;	
        texcoords = intersects[ 0 ].uv
        console.log('FORUV--->',texcoords);
        console.log('SELECTED--->',SELECTED.name);
    }
    if(texcoords){
        
        let val_X = texcoords.x;
        let val_Y = texcoords.y;
        posX = (val_X * 512) | 0;
        posY = (512 - val_Y * 512) | 0;
        rect1 = canvasOne.upperCanvasEl.getBoundingClientRect();
        clientX = posX + rect1.left | 0;
        clientX = posY + rect1.top | 0;
        let screenX = 0;
		let screenY = 0;
        let evt = document.createEvent("MouseEvents");
        console.log(evt);
        evt.initMouseEvent(name, true, true, window, 1, screenX, screenY, clientX, clientY, event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, event.button, window.upperCanvasEl);
        return evt;
    }
    else {
	}
	return null;
}*/
var getMousePosition = function ( dom, x, y ) {
    var rect = dom.getBoundingClientRect();
    return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];
};
const getEvent = (evt)=>{
    evt.preventDefault();
    // var array = getMousePosition(raycastContainer, evt.clientX, evt.clientY);
    // init.renderer.domElement.getBoundingClientRect();  
    // mouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
    // mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;  
    var array = getMousePosition( init.renderer.domElement, evt.clientX, evt.clientY );
    onClickPosition.fromArray( array );
    // raycaster.setFromCamera( mouse, init.cameraMain );
    // let intersects = raycaster.intersectObjects( init.scene.children );
    var intersects = getIntersects( onClickPosition, init.scene.children );
    let texcoords = null;
    if ( intersects.length > 0 && intersects[ 0 ].uv ) {	 
        // SELECTED = intersects[ 0 ].object;	
        var uv = intersects[ 0 ].uv;
        intersects[ 0 ].object.material.map.transformUv( uv );

        var circle = new fabric.Circle({
            radius: 3,
            left: getRealPosition( "x", uv.x ),
            top: getRealPosition( "y", uv.y ),
            fill: 'red'
        });
        canvasOne.add( circle );
        /*texcoords = intersects[ 0 ].uv
        intersects[0].object.material.map.transformUv(texcoords);*/
        var selected = getObjectUnderPoint(uv);
         console.log(selected);
        if (selected != null) {
            console.log(selected);
          init.controls.enabled = false;
          canvasOne.setActiveObject(selected);
          canvasOne.renderAll();
        } else {
            canvasOne.discardActiveObject().renderAll();
            init.controls.enabled = false;
        }
    }
}
var getIntersects = function ( point, objects ) {
    mouse.set( ( point.x * 2 ) - 1, - ( point.y * 2 ) + 1 );
    raycaster.setFromCamera( mouse, init.cameraMain );
    return raycaster.intersectObjects( objects );
};
function getRealPosition( axis, value ) {
    let CORRECTION_VALUE = axis === "x"? 4.5: 5.5;
    return Math.round( value * 512 ) - CORRECTION_VALUE;
}
var getObjectUnderPoint = function (uv) {   
    var cp = { x: uv.x *512, y: uv.y*512 };
    var objects = canvasOne.getObjects();
    console.log(objects[0]);
    for (var i = 0; i < objects.length; i++) {       
     var obj = objects[i];
    // canvasOne.obj.setCoords(); 
     if (!canvasOne.containsPoint(null,obj, cp))continue;      
       let isIntersecting = canvasOne.isTargetTransparent(obj, cp.x, cp.y);
      if (isIntersecting) {
          return obj;
      }
    }
    return null;
  };
/*
const getEvent = (name,event) => {
   
    raycaster.setFromCamera( mouse, init.cameraMain );
    let intersects = raycaster.intersectObjects( init.scene.children );
    let texcoords = null;
    if ( intersects.length > 0 ) {	 
        // SELECTED = intersects[ 0 ].object;	
        texcoords = intersects[ 0 ].uv
    }
    if(texcoords){        
        let val_X = texcoords.x;
        let val_Y = texcoords.y;
        posX = (val_X * 512) | 0;
        posY = (512 - val_Y * 512) | 0;
        rect1 = canvasOne.upperCanvasEl.getBoundingClientRect();
        clientX = posX + rect1.left | 0;
        clientX = posY + rect1.top | 0;
        let screenX = 0;
		let screenY = 0;
        let evt = document.createEvent("MouseEvents");
        // console.log(evt);
        evt.initMouseEvent(name, true, true, window, 1, screenX, screenY, clientX, clientY, event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, event.button, window.upperCanvasEl);
        return evt;
    }
    else {
	}
	return null;
}
const onPointer = function (event) {
	event.stopPropagation();
	var e = getEvent(event.type.replace("pointer", "mouse"), event);
	// console.log(e);
	if (e != null) {
		canvasOne.upperCanvasEl.dispatchEvent(e);
	}
	
	// Set current cursor used by fabricjs
	// renderCanvas.style.cursor = fabricCanvas.upperCanvasEl.style.cursor;
	// Important for Internet Explorer!
	return false;
};*/
function onMouseMove(  event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}
class objLoad {
    constructor() {

    }

    Model() {
        this.loader = new GLTFLoader();
        this.loader.load(gltfpath, gltf => {            
            this.mesh = gltf.scene;
            this.mesh.position.set(0, 0, 0);
            init.scene.add(this.mesh);
        });
    }
}
