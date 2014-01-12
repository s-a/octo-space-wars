var Planet = function  (config) {
 	config = config || {id:-1};
 	this.id = config.id;
	this.config = config;
	if (window.Player) {this.player = new Player()} else { this.player = {color:new Color("#000000")}};
	this.units = (config.id === 1 ? 1000 : (config.id%2===0 ? 100 : 10));

 	var formatPlanetName = function  (timestamp) {
		return timestamp.toFixed(2).replace(/./g, function(c, i, a) {
		    return i && c !== "-" && !((a.length - i) % 6) ? '/' + c : c;
		}).replace(".00","");
 	}
 	
	this.getName = function(){ 
		return config.name || "P-" + this.config.parent + "/" + this.id;
	}

	var shape;
   

	this.setText = function  (){
		shape = new THREE.TextGeometry(this.getName() + " * " + this.units, {
			font: 'helvetiker', 
			size: 6,  
			bevelEnabled : false,
			height : 0 
		});

		if (this.text) {
			var oldpos = this.text.position;
			gameEngine.scene.remove(this.text);
		}
		
	  	var newText = new THREE.Mesh(shape, new THREE.MeshBasicMaterial({color: this.player.color.hex(), opacity: 0.8 }) );
	  	if (oldpos) newText.position.set(oldpos.x, oldpos.y, oldpos.z);
	  	if (gameEngine.camera) newText.lookAt(gameEngine.camera.position);
	  	this.text = newText;
 	  	//textMesh.userData = this;
	}

	if (!config.isSun){
		this.setText();
	}
		
	var planet, material,surface, light, atmosphere;
	this.conquer = function  (player) {
		this.player = player;
		
		if (planet) gameEngine.scene.remove(planet);
		if (atmosphere) gameEngine.scene.remove(atmosphere);
		planet = new THREE.Object3D();
		atmosphere = new THREE.Object3D();
		var planet_geometry = new THREE.SphereGeometry( config.size, config.size, config.size );
		var atmosphere_geometry = new THREE.SphereGeometry( config.size+5, config.size+5, config.size+5 );
 
		material = new THREE.MeshPhongMaterial({
		  map: gameEngine.material[config.surfaceTexture], // THREE.ImageUtils.loadTexture( "images/" + config.surfaceTexture ),
		  color: 13750737,
		  ambient: 13092807,
		  emissive: config.emissive || 595494,
		  specular: 3223857,
		  shininess: 25,
		  opacity: 1,
		  transparent: false,
		  wireframe: false 
		});
		surface = new THREE.Mesh( planet_geometry, material );
		var atmosphere_material = new THREE.MeshPhongMaterial({
			//map: THREE.ImageUtils.loadTexture( "images/" + config.atmosphereTexture ),
			color: this.player.color.hex(),
			ambient: 16777215,
			emissive: 1381653,
			specular: 16777215,
			shininess: 15000,
			opacity: 0.3,
			transparent: true,
			wireframe: false
		});

		planet.add(surface);
	 
 
		if (config.isSun){
			// LIGHT
			light = new THREE.PointLight(0xFFFFFF); 
			light.position.set(0,0,0);
			light.intensity = 2;
		}  else {
			surface = new THREE.Mesh( atmosphere_geometry, atmosphere_material ); 
			atmosphere.add(surface); 
		}


		this.planet = planet;
		this.atmosphere = atmosphere;


	}

	this.getSize = function(size) {
		var bigSunSize = 20;
		var sunSize = 1392000;
		var s = ((size/2 )/(sunSize/2 )*bigSunSize)+10;
		return s;
	}

 	config.size = this.getSize(config.size);
	this.conquer(this.player);

	


	this.distance = function(target, time) {
		var targetPosition = target.position((gameEngine.timeMachine() + time) * 0.025);
		var s = this.position(time);
		var t = target.position(time); 
		var d1 = (t.x-s.x)*(t.x-s.x);
		var d2 = (t.y-s.y)*(t.y-s.y);
		var d3 = (t.z-s.z)*(t.z-s.z);
		return Math.sqrt(d1+d2+d3);
	}

	this.position = function(t){
		var speed = 100/config.yearInDays ;
		var radius = this.getSize( config.distance * 1000000)/10;
		var pos = new THREE.Vector3(
			radius * Math.sin(speed * t * Math.PI),
			radius * Math.cos(speed * t * Math.PI),
			radius * Math.sin(speed * t * Math.PI)
		);

		return pos;
	}

	this.move = function(x, y, z) {
		this.planet.position.set( x, y, z );
		this.atmosphere.position.set( x, y, z );
		if (this.text){
			this.text.position.set( x - config.size, y - (config.size*1.5), z - config.size );
			this.text.lookAt(gameEngine.camera.position);
		}
	}

 

	this.render = function  (scene) {
	  	scene.add( this.planet );
	 	scene.add( this.atmosphere );
 		scene.remove(this.text);
 		scene.add(this.text);	

		material.userData = {planet:this};
		surface.userData = {planet:this};

	 	if (light) scene.add( light );
	}

	return this;
}