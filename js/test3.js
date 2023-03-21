            console.clear();
            console.log("starting scripts...");

            /**
             * Fabricjs
             * @type {fabric}
             */

            var canvas = new fabric.Canvas( "canvas" );
            canvas.backgroundColor = "#FFBE9F";

            var rectangle = new fabric.Rect( {
                top: 100,
                left: 100,
                fill: '#FF6E27',
                width: 100,
                height: 100,
                transparentCorners: false,
                centeredScaling: true,
                borderColor: 'black',
                cornerColor: 'black',
                corcerStrokeColor: 'black'
            } );

            canvas.add( rectangle );


            /**
             * Threejs
             */

            var containerHeight = "512";
            var containerWidth = "512";
            var camera, renderer, container, scene, texture, material, geometry,
                cube;

            var raycaster = new THREE.Raycaster();
            var mouse = new THREE.Vector2();
            var onClickPosition = new THREE.Vector2();

            init();
            animate();


            /**
             * Configurator init function
             */

            function init() {

                /**
                 * Camera
                 */

                camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.01, 100 );
                camera.position.set( 0, 0, 3.5 );


                /**
                 * Renderer
                 */

                container = document.getElementById( "renderer" );
                renderer = new THREE.WebGLRenderer( { antialias: true } );
                renderer.setPixelRatio( window.devicePixelRatio );
                renderer.setSize( containerWidth, containerHeight );
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                container.appendChild( renderer.domElement );


                /**
                 * Scene
                 */

                scene = new THREE.Scene();
                scene.background = new THREE.Color( 0x000000 );


                /**
                 * Texture and material
                 */

                texture = new THREE.Texture( document.getElementById( "canvas" ) );
                texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

                material = new THREE.MeshBasicMaterial( { map: texture } );


                /**
                 * Model
                 */

                 geometry = new THREE.BoxGeometry( 1, 1, 1 );
                 cube = new THREE.Mesh( geometry, material );
                 scene.add( cube );
            }


            /**
             * Configurator frame render function
             */

            function animate() {
                requestAnimationFrame( animate );

                cube.rotation.x += 0.004;
                cube.rotation.y += 0.001;
                texture.needsUpdate = true;

                renderer.render( scene, camera );
            }


            /**
             * Listeners
             */

            container.addEventListener( "mousedown", onMouseClick, false );


            /**
             * Other methods
             */

            function onMouseClick( evt ) {
                evt.preventDefault();

                var array = getMousePosition( container, evt.clientX, evt.clientY );
                onClickPosition.fromArray( array );

                var intersects = getIntersects( onClickPosition, scene.children );

                if ( intersects.length > 0 && intersects[ 0 ].uv ) {
                    var uv = intersects[ 0 ].uv;
                    intersects[ 0 ].object.material.map.transformUv( uv );

                    var circle = new fabric.Circle({
                        radius: 3,
                        left: getRealPosition( "x", uv.x ),
                        top: getRealPosition( "y", uv.y ),
                        fill: 'red'
                    });
                    canvas.add( circle );
                }
            }

            function getRealPosition( axis, value ) {
                let CORRECTION_VALUE = axis === "x"? 4.5: 5.5;

                return Math.round( value * 512 ) - CORRECTION_VALUE;
            }

            var getMousePosition = function ( dom, x, y ) {
                var rect = dom.getBoundingClientRect();
                return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];
            };

            var getIntersects = function ( point, objects ) {
				mouse.set( ( point.x * 2 ) - 1, - ( point.y * 2 ) + 1 );
				raycaster.setFromCamera( mouse, camera );
				return raycaster.intersectObjects( objects );
			};