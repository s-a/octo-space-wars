var Planet = function  (config) {
 	
 	this.id = config.id;
	this.config = config;

 	var formatPlanetName = function  (timestamp) {
		return timestamp.toFixed(2).replace(/./g, function(c, i, a) {
		    return i && c !== "-" && !((a.length - i) % 6) ? '/' + c : c;
		}).replace(".00","");
 	}
 	
	this.getName = function(){ 
		return config.name || "P-" + this.config.parent + "/" + this.id;
	}

	if (!config.isSun){
		var shape = new THREE.TextGeometry(config.name || this.getName(), {
			font: 'helvetiker', 
			size: 6,  
			bevelEnabled : false,
			height : 0 
		});

	    var cylBleu = new THREE.MeshBasicMaterial({color: 0xFF0000, opacity: 0.8 }); 
	  	var textMesh = new THREE.Mesh(shape, cylBleu);
	  	//textMesh.userData = this;
	}



	this.getSize = function(size) {
		var bigSunSize = 20;
		var sunSize = 1392000;
		var s = ((size/2 )/(sunSize/2 )*bigSunSize)+10;
		return s;
	}

 	config.size = this.getSize(config.size);
	var planet = new THREE.Object3D();
	var planet_geometry = new THREE.SphereGeometry( config.size, config.size, config.size );
	var atmosphere = new THREE.Object3D();
	var atmosphere_geometry = new THREE.SphereGeometry( config.size+5, config.size+5, config.size+5 );
	var material = new THREE.MeshPhongMaterial({
	  map: THREE.ImageUtils.loadTexture( "images/" + config.surfaceTexture ),
	  color: 13750737,
	  ambient: 13092807,
	  emissive: config.emissive || 595494,
	  specular: 3223857,
	  shininess: 25,
	  opacity: 1,
	  transparent: false,
	  wireframe: false 
	});
	var surface = new THREE.Mesh( planet_geometry, material );
	var atmosphere_material = new THREE.MeshPhongMaterial({
		//map: THREE.ImageUtils.loadTexture( "images/" + config.atmosphereTexture ),
		color: 0xFF0000,
		ambient: 16777215,
		emissive: 1381653,
		specular: 16777215,
		shininess: 15000,
		opacity: 0.3,
		transparent: true,
		wireframe: false
	});

	planet.add(surface);
 
	var light; 
	if (config.isSun){
		// LIGHT
		light = new THREE.PointLight(0xFFFFFF); 
		light.position.set(0,0,0);
		light.intensity = 2;
	}  else {
		surface = new THREE.Mesh( atmosphere_geometry, atmosphere_material ); 
		atmosphere.add(surface); 
	}


	


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
			this.text.lookAt(gameEngine.camera.position);
			this.text.position.set( x - config.size, y - (config.size*1.5), z - config.size );
		}
	}

	this.planet = planet;
	this.atmosphere = atmosphere;
	this.text = textMesh;

	this.render = function  (scene) {
	  	scene.add( this.planet );
	 	scene.add( this.atmosphere );
	 	if (this.text) scene.add( this.text );
		material.userData = {planet:this};
		surface.userData = {planet:this};

	 	if (light) scene.add( light );
	}

	return this;
}