var Computer = function(gameEngine){
	var currentPlayerIndex = 1;
	var currentPlayer = null;

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
		if (!source.flyto(target, 10)) {
			alert("done!");
		} 
	}

	return this;
}
