var GameEngineCamera = function  (argument) {

	this.route = [];

	this.look = function  () {
		gameEngine.camera.lookAt(this.lookAt);
	}

	this.focus = function(pos){
		this.lookAt = pos;
		return this;
	};

	this.move = function  (target, lookAt, lookAtNext, callback) {
		this.callback = callback;
		/*var newQuaternion = new THREE.Quaternion();
		THREE.Quaternion.slerp(camera.quaternion, destinationQuaternion, newQuaternion, 0.07);
		camera.quaternion = newQuaternion;*/
		var geometry = new THREE.Geometry();
		var material = new THREE.LineBasicMaterial({
		    color: gameEngine.config.flyerTrackLine.color,
		    transparent: false,
		    opacity: gameEngine.config.flyerTrackLine.opacity
		});

		var attackTimer = 1;
		var targetPosition = ( typeof(target.position) === "function" ? target.position((gameEngine.timeMachine() + attackTimer) * 0.025) : target.position);
 		this.focus(lookAt.position((gameEngine.timeMachine() + attackTimer) * 0.025));
	 	sourcePosition = gameEngine.camera.position;
		spline = new THREE.SplineCurve3([
		   new THREE.Vector3(sourcePosition.x,sourcePosition.y,sourcePosition.z),
		   new THREE.Vector3(sourcePosition.x+ 5,sourcePosition.y+ 5,sourcePosition.z- 2),
		   new THREE.Vector3(sourcePosition.x- 20,sourcePosition.y-  10,sourcePosition.z-  19),
		   new THREE.Vector3(targetPosition.x + target.config.size*4,targetPosition.y - target.config.size*4, targetPosition.z + target.config.size*4)
		]);

		var splinePoints = spline.getPoints(450);

		if (false) {
			flowI = 0;
			for(var i = 0; i < splinePoints.length; i++){
			    geometry.vertices.push(splinePoints[i]);
			}
			for(var i = 0; i < splinePoints.length; i++){
			    geometry.vertices.push(splinePoints[i]);
			}
 	 		line = new THREE.Line(geometry, material);
			gameEngine.scene.add(line);
		}
		this.routeLength = splinePoints.length;

		this.route = splinePoints;
		return this;
	}

	return this;
}