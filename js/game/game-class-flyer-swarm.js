var FID=-1;
/**
 * Description
 * @class FlyerSwarm
 * @constructor
 * @param {} gameEngine
 * @param {} config
 * @param {} callback
 * @return ThisExpression
 */
var FlyerSwarm = function(gameEngine, config, callback){
	 
	var count = 1;
	var geometry = new THREE.Geometry();
	var bezier;
	var splinePoints;
	var targetHitTime = null;
	var numPoints = 400;
	var sourcePosition;


	var  targetHitTime;
	var material = new THREE.LineBasicMaterial({
	    color: config.source.player.color.hex(),
	    transparent: true,
	    opacity: gameEngine.config.flyerTrackLine.opacity
	});
	var line ;
	FID = FID+1;
	this.id = FID;
	this.target = config.target;
	this.source = config.source;
	this.particleGeometry = new THREE.Geometry();
	this.flyer = [];
	this.clock = new THREE.Clock();
	var attackTimer =  10;
	var distance  ;

	/**
	 * Description
	 * @method speed
	 * @return 
	 */
	var speed = function() {
		// body...
	}
	var distance;

	/**
	 * Description
	 * @method flyerPosition
	 * @param {} timeOffset
	 * @param {} index
	 * @param {} source
	 * @param {} target
	 * @param {} drawline
	 * @return NewExpression
	 */
	this.flyerPosition = function(timeOffset, index, source, target, drawline){

		//var t = target.position(gameEngine.timeMachine());
		//console.log(this.targetPosition);
		if (!this.targetPosition) {
			distance = source.distance(target, timeOffset);//point;
		 	targetHitTime = (timeOffset)+ (distance / attackTimer);
			var s = source.position(gameEngine.timeMachine()*0.025);
			//console.log(targetHitTime);
			this.targetPosition = target.position((gameEngine.timeMachine() + attackTimer) * 0.025);

 
		 	sourcePosition = s;
			spline = new THREE.SplineCurve3([
			   new THREE.Vector3(sourcePosition.x,sourcePosition.y,sourcePosition.z),
			   new THREE.Vector3(sourcePosition.x+40,sourcePosition.y-20,sourcePosition.z+40),
			   new THREE.Vector3(this.targetPosition.x,this.targetPosition.y,this.targetPosition.z)
			]);
			splinePoints = spline.getPoints(distance);
			flowI = 0;
			for(var i = 0; i < splinePoints.length; i++){
			    geometry.vertices.push(splinePoints[i]);
			}
			if (drawline) {
				for(var i = 0; i < splinePoints.length; i++){
				    geometry.vertices.push(splinePoints[i]);
				}
	 	 		line = new THREE.Line(geometry, material);
				gameEngine.scene.add(line);
			}


			//console.log(line)
		}
	 //document.title = xx;

		// smooth my curve over this many points
	 	var xx = (distance / attackTimer) * this.clock.getElapsedTime();
		var point = Math.floor(xx);
		//document.title = xx;
		var vPoint = splinePoints[point+(index)];
		if (vPoint){
			var x = vPoint.x ;//+ ((index*2) + index%2)*Math.sin(uniforms.time.value);
			var y = vPoint.y ;//+ (index/2)/t0*0.025;
			var z = vPoint.z ;//+ vPoint.y%2+index/2.5;
		} else {
		}
		
		//		document.title = targetHitTime +","+ gameEngine.timeMachine()*0.025 + (gameEngine.timeMachine()*0.025>targetHitTime);
		return new THREE.Vector3(x,y,z);
	}

	for (var i = 0; i < count; i++) this.flyer.push(new Flyer(gameEngine, this, config));
	var shaderMaterial = new THREE.ShaderMaterial({
		uniforms: 		gameEngine.uniforms,
		attributes:     gameEngine.attributes,
		vertexShader:   document.getElementById( 'vertexshader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
		transparent: true
	});

	var particleCube = new THREE.ParticleSystem( this.particleGeometry, shaderMaterial );
	//particleCube.position.set(config.coords.x,config.coords.y,config.coords.z);
	particleCube.dynamic = true;
	particleCube.sortParticles = true;
	particleCube.userData.sourcePlanet = this.target;
	particleCube.userData.targetPlanet = this.target;
	gameEngine.scene.add( particleCube );

	/**
	 * Description
	 * @method move
	 * @param {} drawline
	 * @return 
	 */
	this.move = function(drawline){
		for( var v = 0; v < this.particleGeometry.vertices.length; v++ ) {
			var timeOffset = gameEngine.uniforms.time.value + gameEngine.attributes.customOffset.value[ v ];

			var pos = this.flyerPosition(timeOffset, v, this.source, this.target, drawline);
			if (pos.x){
				this.particleGeometry.vertices[v] = pos;
			} else {
				if (v===this.particleGeometry.vertices.length-1){
					var p = particleCube.userData.targetPlanet;

					if (p.player.color.equal(this.source.player.color)){
						p.units++;
					} else {
						p.units--;
						if (p.units <= 0){
							gameEngine.sound.sample["smallexplosion1"].play();
							p.conquer(this.source.player);
							gameEngine.alert({
								type: "success",
								seconds: 3,
								msg:"A planet was conquered!",
								color: this.source.player.color
							});
						}
					}
					p.setText();
					gameEngine.scene.remove( particleCube );
					gameEngine.scene.remove( line );
					this.particleGeometry.vertices = [];
					for (var i = 0; i < gameEngine.swarms.length; i++) {
						if (!p.defenseAlertDone){
							p.defenseAlertDone = true;
							//gameEngine.sound.samples("autodefense_ep").play(0.5);
							gameEngine.sound.sample["autodefense_ep"].play();
						}
						 
						var s = gameEngine.swarms[i];
						if (s.id === this.id) gameEngine.swarms.remove(i);
						break;
					};
				}

			}
		}
	}

	gameEngine.swarms.push(this);
	return this;
};