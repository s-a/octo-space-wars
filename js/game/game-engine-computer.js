
var PlanetaryEvent = function(){
	return this;
}


var PlayerSummary = function  () {
	this.players = [];


	this.bind = function(select){
		select.html("");
	    $.each(this.players, function (id, player) {
	    	var element = $('<div><sup>' + (player.units * player.planets) + "</sup> " + player.name + '</div>');
	    	element.css({
	    		color: player.color.lum(0.5).hex(),
	    		"text-shadow": gameEngine.css.glow(player.color.lum())
	    	});	
	    	select.prepend(element);
	    });  
	}

	this.get = function(player) {
		var result = null;
		for (var i = 0; i < this.players.length; i++) {
			var p = this.players[i];
			if (p.color.equal(player.color)){
				result = p;
				break;
			}
		};
		return result;
	}

	this.add = function(fromPlanet) {
		var player = this.get(fromPlanet.player);
		if (player){
			player.planets++;
			player.units += fromPlanet.units;
		} else {
			var p = jQuery.extend(true, {}, fromPlanet.player);
			p.planets = 1;
			p.units = fromPlanet.units;
			this.players.push(p);
		}
	}

	this.init = function() {
		for (var i = 0; i < gameEngine.planets.length; i++) {
			var planet = gameEngine.planets[i];
			this.add(planet);
		};

		this.players = this.players.sort(function(a,b) {
			return (a.units * a.planets) - (b.units * b.planets);
		});
	}

	this.init();

	return this;

}


/**
 * Description
 * @class Computer
 * @constructor
 * @param {} gameEngine
 * @return ThisExpression
 */
var Computer = function(gameEngine){
	var currentPlayerIndex = 1;
	var currentPlayer = null;

	this.gameEngine = gameEngine;
	this.events = [];

	this.refreshGameStatistics = function(){
		return new PlayerSummary();
	}


	/**
	 * Description
	 * @method desaster
	 * @return 
	 */
	this.desaster = function() {
		this.events[0]();
	}

	/**
	 * Description
	 * @method isEnemy
	 * @param {} player
	 * @param {} planet
	 * @return UnaryExpression
	 */
	this.isEnemy = function  (player, planet) {
		if (!player) return true;
		return !player.color.equal(planet.player.color);
	}

	/**
	 * Description
	 * @method weakestEnemy
	 * @param {} currentPlanet
	 * @return 
	 */
	this.weakestEnemy = function(currentPlanet) {
		for (var i = 1; i < this.gameEngine.planets.length; i++) {
			var planet = this.gameEngine.planet(i);
			if (this.isEnemy(currentPlanet.player, planet)) return planet;
		};
	}

	/**
	 * Description
	 * @method nextPlayerPlanet
	 * @return 
	 */
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

	/**
	 * Description
	 * @method play
	 * @return 
	 */
	this.play = function  () {
 
		var source = this.nextPlayerPlanet();
		var target = this.weakestEnemy(source);
		if (!source.flyto(target, 10)) {
			alert("done!");
		} 
	}

	return this;
}
