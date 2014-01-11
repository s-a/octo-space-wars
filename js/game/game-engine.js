 
 
var planets = [];
var GameEngine = function() {
	var self = this;
	var container, renderer, controls, stats;
	var keyboard = new THREEx.KeyboardState();
	var mouse = new THREE.Vector2() , INTERSECTED;;
	var projector = new THREE.Projector();
	var raycaster = new THREE.Raycaster();

	this.clock = new THREE.Clock();
	this.swarms = [];
	this.config = {
		trackLinesEverFlyer : 50,
		flyerTrackLine : {
			opacity :  0.05 ,
    		color   : 0x66FF33
		}
	}

	this.sound = {};
	this.sound.Music = function  () {
	 	var audio = document.createElement('audio');
		var source = document.createElement('source');
		
		source.src = window.location.pathname.replace("game.html", "") + 'sound/track' + (Math.floor(Math.random()*2)+1 /*track length*/) + '.mp3';
		audio.appendChild(source);
		audio.play();
		return audio;
	}

	this.sound.music = new this.sound.Music();

	var Navigation = function() {
		this.computeSecurePath = function (setup) {
			return new THREE.SplineCurve3([
			   new THREE.Vector3(setup.source.x,setup.source.y,setup.source.z),
			   new THREE.Vector3(setup.source.x+40,setup.source.y-20,setup.source.z+40),
			   new THREE.Vector3(setup.target.x,setup.target.y,setup.target.z)
			]).getPoints(setup.steps || 1000);
		}
		return this;
	}

	this.navigation = new Navigation();
	//this.FlyerController = new FlyerController();

	this.render = function(){
		for (var i = 0; i < planets.length; i++) {
			var planet = planets[i];
			planet.render(this.scene);
		};



				// find intersections
				var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
				projector.unprojectVector( vector, this.camera );
				raycaster.set( this.camera.position, vector.sub( this.camera.position ).normalize() );
				var intersects = raycaster.intersectObjects( this.scene.children, true );

				if ( intersects.length > 0 ) {
					if ( intersects[ 0 ].object.userData.planet && intersects[ 0 ].object.userData.planet.text &&  INTERSECTED != intersects[ 0 ].object ) {
						if ( INTERSECTED ) { 
							INTERSECTED.material.color = INTERSECTED.currentHex;
							INTERSECTED.userData.planet.text.material.color = INTERSECTED.currentHex;
						}
						INTERSECTED = intersects[ 0 ].object;
						INTERSECTED.currentHex = INTERSECTED.material.color;

						INTERSECTED.material.color = new THREE.Color( 0xFFFFFF );
						INTERSECTED.userData.planet.text.material.color = new THREE.Color( 0xFFFFFF ); 
					}
				} else {
					if ( INTERSECTED ) {
						INTERSECTED.material.color = INTERSECTED.currentHex;
						INTERSECTED.userData.planet.text.material.color = INTERSECTED.currentHex;
					}
					INTERSECTED = null;
				}



		renderer.render( this.scene, this.camera );
	}

	this.onDocumentMouseMove = function( event ) {
		event.preventDefault();
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	}

	this.cam = new GameEngineCamera();


	this.onDocumentMouseDown= function( event ) {
		event.preventDefault();
		if (INTERSECTED){
			var source = INTERSECTED.userData.planet;
			var target = gameEngine.randomPlanet([0,source.id]);
			var ii=0;
			var i = window.setInterval(function() {
				new FlyerSwarm(gameEngine, {
					target : target,
					source : source
				}, 1);
				ii++;
				if (ii===100){
					window.clearInterval(i);
				}
			},800);
		 
		}
	}

	this.init = function(){
		document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
		document.addEventListener( 'mousedown', this.onDocumentMouseDown, false );
		// SCENE
		this.scene = new THREE.Scene();
		// CAMERA
		var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
		var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
		this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
		this.scene.add(this.camera);
		this.camera.position.set(0,1200,400);
		this.camera.lookAt(this.scene.position);
		// RENDERER
		if ( Detector.webgl )
			renderer = new THREE.WebGLRenderer( {antialias:true} );
		else
			renderer = new THREE.CanvasRenderer();
	    renderer.setClearColor(0x000000, 1);
		renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
		container = document.getElementById( 'ThreeJS' );
		container.appendChild( renderer.domElement );
		// EVENTS
		THREEx.WindowResize(renderer, this.camera);
		THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
		// CONTROLS
		controls = new THREE.OrbitControls( this.camera, renderer.domElement );
		// STATS
		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.bottom = '0px';
		stats.domElement.style.zIndex = 100;
		container.appendChild( stats.domElement );



		// FLOOR
			// SKYBOX/FOG
			 var imagePrefix = "images/nebula-";
			var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
			var imageSuffix = ".png";
			var skyGeometry = new THREE.CubeGeometry( 5000, 5000, 5000 );

			var materialArray = [];
			for (var i = 0; i < 600; i++)
				materialArray.push( new THREE.MeshBasicMaterial({
					map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
					side: THREE.BackSide
				}));
			var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
			var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
			 this.scene.add( skyBox );
			////////////
			// CUSTOM //
			////////////
		// values that are constant for all particles during a draw call
		var discTexture = THREE.ImageUtils.loadTexture( 'images/disc.png' );
		this.uniforms = {
			time:      { type: "f", value: 1.0 },
			texture:   { type: "t", value: discTexture },
		};
		// properties that may vary from particle to particle.
		// these values can only be accessed in vertex shaders!
		//  (pass info to fragment shader via vColor.)
		this.attributes = {
			customColor:	 { type: 'c',  value: [] },
			customOffset:	 { type: 'f',  value: [] },
		};
	}

	this.start = function() {
		initializeViewData();
		this.init();
		animate(planets);
	};

	this.randomPlanet = function(ignore) {
		if (!ignore) ignore = [];
		var result = null;
		ignore.push(null);
		var planetId = null;
		while(ignore.indexOf(planetId) !== -1) planetId = Math.floor(Math.random()*planets.length);
		planets[planetId].id = planetId;
		return planets[planetId];
	}


	this.detectCollision = function (oldPostion, newPosition, distance) {
	 
		var projector = new THREE.Projector();
		var vector = oldPostion; // new THREE.Vector3( oldPostion );
		projector.unprojectVector( vector, this.camera );
		raycaster.set( newPosition, vector.sub( newPosition ).normalize() );
		var intersects = raycaster.intersectObjects( this.scene.children, true ); 
	  	return (intersects.length > 0) && (intersects[0].distance <= distance);
	}
	function degInRad(deg) {
	    return deg * Math.PI / 180;
	} 
	this.updateCamera = function  () { 
		if (this.cam.route.length>0){
			var newPos = this.cam.route.shift();
		/*		while (this.detectCollision(this.camera.position, newPos, 300)){
				newPos.x=newPos.x+1;
				newPos.y=newPos.y-1;
				newPos.z=newPos.z-1;
			}*/
			this.camera.position.x = newPos.x;
			this.camera.position.y = newPos.y;
			this.camera.position.z = newPos.z; 


			if (this.cam.route.length === 0){
				this.cam.callback();
			}

			this.cam.look();
		}
	}

	this.update = function(){
	 	gameEngine.t0 = gameEngine.clock.getElapsedTime();

		if ( keyboard.pressed("b") ) 	{
			var rp = planets[3];
			new FlyerSwarm(gameEngine, {
				target : this.randomPlanet([0,3]),
				source : rp
			}, 1);
		}

		controls.update();
		stats.update();

	  	this.t0 = this.clock.getElapsedTime();
		this.uniforms.time.value = this.timeMachine(this.t0);

		for (var s = 0; s < this.swarms.length; s++) {
			var swarm = this.swarms[s];
			swarm.move(s%this.config.trackLinesEverFlyer===0);
		};

		for (var i = 0; i < planets.length; i++) {
			var planet = planets[i];
			var pos = planet.position(this.uniforms.time.value);
			planet.move(pos.x,pos.y,pos.z);
		};
	}

	this.timeMachine = function(elapsedTime){
		return 0.025 * elapsedTime || gameEngine.clock.getElapsedTime();
	}
}

window.gameEngine = new GameEngine(window);
gameEngine.start();
function animate() {
	var id = window.requestAnimationFrame( animate );
	gameEngine.render(planets);
	gameEngine.update(planets);
	gameEngine.updateCamera();
}

// intro
gameEngine.cam.move(planets[1], planets[1], planets[0], function(){
	gameEngine.cam.move({position:{x:1100,y:0,z:0},config:{size:10}}, planets[0], planets[0], function(){
	 	alert("Defend the habitat of your civilization!");
	});
});

