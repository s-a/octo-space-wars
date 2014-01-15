var Computer = function(gameEngine){
	var currentPlayerIndex = 1;
	var currentPlayer = null;
	var ii = 0;
	this.gameEngine = gameEngine;
 

	this.isEnemy = function  (player, planet) {
		if (!player) return true;
		return !player.color.equal(planet.player.color);
	}

 
	this.weakestEnemy = function(currentPlanet) {
		for (var i = 1; i < this.gameEngine.planets.length; i++) {
			var planet = this.gameEngine.planet(i);
			if (this.isEnemy(currentPlanet.player, planet)) return planet;
		};
	}

	this.nextPlayerPlanet = function() {

		if (currentPlayerIndex+1 === this.gameEngine.planets.length-1) currentPlayerIndex = 0;
		for (var i = currentPlayerIndex+1; i < this.gameEngine.planets.length-1; i++) {
			var planet = this.gameEngine.planet(i);
			if ( this.isEnemy(currentPlayer, planet)){
				if (planet.units && planet.units > 1){
					currentPlayerIndex = i;
					currentPlayer = planet.player;
					return planet;
				}
			}
		};
		currentPlayerIndex = 0;
	}

	this.play = function  () {
 
		var source = this.nextPlayerPlanet();
		var target = this.weakestEnemy(source);
		console.log(source, source.id);
		if (target){
			
			var i = window.setInterval(function() {
				if (source.units > 1){
					new FlyerSwarm(gameEngine, {
						target : target,
						source : source
					}, 1, function(){

					});
					source.units--;
					source.setText(); 
				} else {
					gameEngine.sound.sample["computer_error"].play();
				}
				ii++;

				if (ii===10 || source.units < 2){
					window.clearInterval(i);
				}
			},500);

		} else {
			alert("donw");
		}
	}

	return this;
}
