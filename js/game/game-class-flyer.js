var Flyer = function(gameEngine, swarm, config, target) {


	function detectCollision() {
	  var vector = target.clone().subSelf( source.position ).normalize();
	  var ray = new THREE.Ray(source.position, vector);
	  var intersects = ray.intersectObjects(planets);

	  if (intersects.length > 0) {
	    if (intersects[0].distance < 5) {
	      console.log(intersects);
	    }
	  }
	}

	this.computeSecureTrack = function  () {
		// body...
	}

	swarm.particleGeometry.vertices.push( new THREE.Vector3(0,0,0) );
	var particleCount = swarm.particleGeometry.vertices.length
	for( var v = 0; v < particleCount; v++ ){
		gameEngine.attributes.customColor.value[ v ] = new THREE.Color().setHSL( 1 - v / particleCount, 1.0, 0.5 );
		gameEngine.attributes.customOffset.value[ v ] = 1 ; // not really used in shaders, move elsewhere
	}

	this.position = function() {

	}

	//swarm.flyer.push(this);
	return this;
};