var gameConfig =  {
	trackLinesEverFlyer : 50,
	flyerTrackLine : {
		opacity :  0.07 ,
		color   : 0x66FF33
	},
	alienStrenth : 200
}
var Player = function  (color) {
	if (color){
		this.color = new Color(color);
	} else {
		this.color = new Color("#000000").random();
	}
	return this;
}
// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
var GameEngine = function() {

	var self = this;
	var container, renderer, controls, stats;
	var keyboard = new THREEx.KeyboardState();
	var mouse = new THREE.Vector2() , INTERSECTED;;
	var projector = new THREE.Projector();
	var raycaster = new THREE.Raycaster();

	this.version = 0.756;
	this.planets = [];
	this.clock = new THREE.Clock();
	this.swarms = [];
	this.config = gameConfig;

	this.sound = {};
	this.sound.Music = function  () {
	 	var audio = document.createElement('audio');
		var source = document.createElement('source');

		source.src = window.location.pathname.replace("game.html", "") + 'sound/track' + (Math.floor(Math.random()*2)+1 /*track length*/) + '.mp3';
		audio.appendChild(source);
		return audio;
	}

	this.sound.Sample = function(sample, volume, onLoad) {
	 	var audio = document.createElement('audio');
		var source = document.createElement('source');
		audio.volume = volume || 0.9;
		audio.addEventListener('canplaythrough',   function() {
			onLoad();
		}, false);
		source.src = 'sound/' + sample + '.mp3';
		audio.appendChild(source);

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


	this.render = function(){
		for (var i = 0; i < this.planets.length; i++) {
			var planet = this.planets[i];
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
			var exclude = [0];
			for (var i = 0; i < gameEngine.planets.length; i++) {
				var p = gameEngine.planets[i]
				if (p.player.color.equal(source.player.color)){
					exclude.push(p.id);
					console.log(exclude);
				}
			};
			if (gameEngine.planets.length === exclude.length) {
				gameEngine.sound.sample["computer_error"].play();
				return;
			}
			var target = gameEngine.randomPlanet(exclude);
			source.flyto(target, 10);
		}
	}

	this.preload = function  (done, update) {
		var materials = [
			"nebula-zpos.png",
			"nebula-zneg.png",
			"nebula-ypos.png",
			"nebula-yneg.png",
			"nebula-xpos.png",
			"nebula-xneg.png",
			"venusmap.jpg",
			"mercurymap.jpg",
			"mercurybump.jpg",
			"mars_1k_color.jpg",
			"jupitermap.jpg",
			"sunmap.jpg"
		];

		var sounds = [
			{name : "autodefense_ep", volume : 0.1},
			{name : "tng_warp4_clean", volume : 1},
			{name : "smallexplosion1", volume : 0.7},
			{name : "computer_error", volume : 1},
			{name : "computer_work_beep", volume : 1},
			{name : "computer_work_beep_simple", volume : 1},
			{name : "system_alarm", volume : 0.6}
		];

		var all = materials.length;
 		var currentIndex = 0;
		for (var i = 0; i < materials.length; i++) {
			var m = materials[i];
			this.material[m] = THREE.ImageUtils.loadTexture( "images/" + m, null	, function(){
				all--;
				if (all===0) loadSounds();
				currentIndex++;
				if (update) update(100/(sounds.length+materials.length)*currentIndex);
			});
		};


		var loadSounds = function() {
			all = sounds.length;
			for (var i = 0; i < sounds.length; i++) {
				var m = sounds[i];

				gameEngine.sound.sample[m.name] = new gameEngine.sound.Sample(m.name, m.volume, function(){
					all--;
					currentIndex++;
					if (update) update(100/(sounds.length+materials.length)*currentIndex);
					if (all===0) done();
				});
			};
		};


		//
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
		var outerPlanet = this.planets[this.planets.length-1];
		var outerPlanetPosition = outerPlanet.position((this.timeMachine()+5) * 0.025);
		this.camera.position.set(outerPlanetPosition.x,outerPlanetPosition.y,outerPlanetPosition.z-outerPlanet.config.size*3);
		this.camera.lookAt(this.planet(0).position(this.timeMachine() * 0.025));
		//this.camera.lookAt(this.scene.position);
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

				var callbackProgress = function( progress, result ) {

					var bar = 250,
						total = progress.totalModels + progress.totalTextures,
						loaded = progress.loadedModels + progress.loadedTextures;

					if ( total )
						bar = Math.floor( bar * loaded / total );

					$( "bar" ).style.width = bar + "px";

					count = 0;
					for ( var m in result.materials ) count++;

					handle_update( result, Math.floor( count/total ) );

				}

	}

	this.start = function() {
		this.planets = new SolarSystem().load(GAMEDATA).planets;
		this.init();
		animate(this.planets);
	};

	this.randomPlanet = function(ignore) {
		if (!ignore) ignore = [];
		var result = null;
		ignore.push(null);
		var planetId = null;
		while(ignore.indexOf(planetId) !== -1) planetId = Math.floor(Math.random()*this.planets.length);
		this.planets[planetId].id = planetId;
		return this.planets[planetId];
	}

	this.detectCollision = function (oldPostion, newPosition, distance) {

		var projector = new THREE.Projector();
		var vector = oldPostion; // new THREE.Vector3( oldPostion );
		projector.unprojectVector( vector, this.camera );
		raycaster.set( newPosition, vector.sub( newPosition ).normalize() );
		var intersects = raycaster.intersectObjects( this.scene.children, true );
	  	return (intersects.length > 0) && (intersects[0].distance <= distance);
	}


	this.computer = new Computer(this);
 
	

	var degInRad = function(deg) {
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

		if ( keyboard.pressed("h") ){

		 	gameEngine.sound.sample["computer_work_beep_simple"].play();
			gameEngine.alert({
				type: "info",
				seconds: 7,
				msg:"octoSpaceWars v" + this.version + " alpha help<br><br>Mouse:<br> * Wheel : Zoom in / out<br> * Left click and drag : Look to another position<br> * Right click and drag : Move camera position in X and Y<br><br>Keyboard:<br> * 'h' : help<br><br>Voice commands (in development):<br><br> * use planet :id<br> * start music<br> * stop music"
			});
			
		}


		if ( keyboard.pressed("0") ){
		 	gameEngine.sound.sample["tng_warp4_clean"].play();
			gameEngine.cam.move({position:{x:3100,y:0,z:0},config:{size:10}}, gameEngine.planet(0), gameEngine.planet(0), function(){
				gameEngine.camera.lookAt(gameEngine.planet(0).position(gameEngine.timeMachine() * 0.025));
				gameEngine.sound.sample["computer_work_beep"].play();
				gameEngine.sound.music.play();
			});			
		}

		if ( keyboard.pressed("1") ){
		 	gameEngine.sound.sample["tng_warp4_clean"].play();
			gameEngine.cam.move(gameEngine.planets[gameEngine.planets.length-1], gameEngine.planet(0), gameEngine.planet(0), function(){
				gameEngine.camera.lookAt(gameEngine.planet(0).position(gameEngine.timeMachine() * 0.025));
				gameEngine.sound.sample["computer_work_beep"].play();
				gameEngine.sound.music.play();
			});			
		}


		controls.update();
		stats.update();

	  	this.t0 = this.clock.getElapsedTime();
		this.uniforms.time.value = this.timeMachine(this.t0);

		for (var s = 0; s < this.swarms.length; s++) {
			var swarm = this.swarms[s];
			swarm.move(s%20===0);
		};

		for (var i = 0; i < this.planets.length; i++) {
			var planet = this.planets[i];
			var pos = planet.position(this.uniforms.time.value);
			planet.move(pos.x,pos.y,pos.z);
		};
	}

	this.timeMachine = function(elapsedTime){
		return 0.025 * elapsedTime || gameEngine.clock.getElapsedTime();
	}

	this.planet = function  (i) {
		return this.planets[i];
	};

	var msgTimer = null;
	this.alert = function(a, callback) {
		$("#alert").attr("class", "").addClass("alert-" + (a.type || "fatal")).html(a.msg);

	 	$("#alert").fadeIn("slow", function() {
		 	window.clearTimeout(msgTimer);
		 	msgTimer = window.setTimeout(function() {
		 		$("#alert").fadeOut("slow", function() {
		 			if (callback) callback();
		 		});
		 	}, a.seconds*1000);
	 	});
	};

	this.material = [];
	this.sound.sample = [];
}

function animate() {
	var id = window.requestAnimationFrame( animate );
	gameEngine.render(this.planets);
	gameEngine.update(this.planets);
	gameEngine.updateCamera();
}


