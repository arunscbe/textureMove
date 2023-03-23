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
let dragging=false,selectedObject;
$(document).ready(function () {
    let detect = detectWebGL();
    if (detect == 1) {
        canvasOne = this.__canvas = new fabric.Canvas('fabCan',{backgroundColor:'#ebf2ff',height:512,width:512 });
        fabric.Object.prototype.transparentCorners = false;
        fabric.Object.prototype.cornerColor = 'blue';
        fabric.Object.prototype.cornerStyle = 'circle';
        initFab();
        init = new sceneSetup(70, 1, 1000, 0, 0, 7);
        modelLoad = new objLoad();
        // modelLoad.Model();
        // init.renderer.domElement.addEventListener('pointerdown', onDocumentMouseDown, true);
        // init.planeObj.material.map = new THREE.Texture(canvasOne); 
        // init.planeObj.material.map.needsUpdate = true;
       
        let paintCanvas = document.getElementById("fabCan");
        let groundTexture = new THREE.CanvasTexture(paintCanvas);
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
        init.renderer.domElement.addEventListener("pointerup", checkMouseEvent, false);
        init.renderer.domElement.addEventListener("pointermove", checkMouseEvent, false);

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
    let rectOne = new fabric.Rect({
        width: 200,
        height: 100,
        fill: 'red',
        stroke: 'green',
        strokeWidth: 3,
        // originX:'center'
    });
    canvasOne.add(rectOne);
    // canvasOne.centerObject(rectOne);
    
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
    if ( intersects.length > 0 && intersects[ 0 ].uv ) {	 	
        var uv = intersects[ 0 ].uv;
        intersects[ 0 ].object.material.map.transformUv( uv );
        var circle = new fabric.Circle({
            radius: 3,
            left: getRealPosition( "x", uv.x ),
            top: getRealPosition( "y", uv.y ),
            fill: 'red'
        });
        // canvasOne.add( circle );
        var selected = getObjectUnderPoint(uv);
        if (selected != null) {
          init.controls.enabled = false;
          selectedObject = canvasOne.setActiveObject(selected);
          canvasOne.renderAll();
          checkMouseEvent(evt,uv);
        } else {
            canvasOne.discardActiveObject().renderAll();
            init.controls.enabled = true;
            selectedObject = '';
        }
    }
}
const checkMouseEvent = (evt,uv)=>{
    if(evt.type === 'pointerdown'){
        dragging = true;
    }
    if(evt.type === 'pointermove'){
        if(dragging && selectedObject !== ''){
            // console.log(evt.clientx + init.renderer.domElement.getBoundingClientRect().left );
            selectedObject.getActiveObject().set({
                left: evt.clientX-105,
                top: evt.clientY-105, 
            })
            selectedObject.getActiveObject().setCoords();
            canvasOne.renderAll();
            console.log('dragging and moving.....');
        }else{
            init.controls.enabled = true;
            console.log('simply moving...');
        }
    }
    if(evt.type === 'pointerup'){
        dragging = false;
        console.log('drag released...');
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
    var objectFound = false;
    let _C ;
    let cp = {
        x : getRealPosition( "x", uv.x ),
        y : getRealPosition( "y", uv.y )
     }
    canvasOne.forEachObject(function (obj) {
    if (!objectFound && obj.containsPoint(cp)) {
        objectFound = true;
        _C = obj;
        }
    });
    return _C;
  };

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
