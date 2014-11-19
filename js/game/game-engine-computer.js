
var interPlanetaryEvents = function(gameEngine){

	var events = [];

	this.add = function(e) {
		events.push(e);
	}

	this.item = function(i) {
		return events[i];
	}

	this.execute = function(index) {
		var event = this.item(index);
		if (!event) event = events.random();
		jQuery.proxy(event.execute, gameEngine)(gameEngine);
	}

	return this;
}


var PlayerSummary = function  () {
	this.players = [];


	this.bind = function(select){
		select.html("");
	    $.each(this.players, function (id, player) {
	    	var element = $('<div><sup>' + (player.units * player.planets) + "</sup> " + player.name + '</div>');
	    	element.css({
	    		color: player.color.hex()// ,
	    		//"text-shadow": gameEngine.css.glow(player.color) performance :(
	    	}).click(function  (argument) {
				//gameEngine.cam.move(s, a, p)
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

	this.addFromPlanet = function(fromPlanet) {
		var player = this.get(fromPlanet.player);
		if (player){
			player.planets++;
			player.units += fromPlanet.units;
		} else {
			var p = new Player(fromPlanet.player.color);
			p.name = fromPlanet.player.name;
			p.planets = 1;
			p.units = fromPlanet.units;
			this.players.push(p);
		}
	}

	this.init = function() {
		for (var i = 1; i < gameEngine.planets.length; i++) this.addFromPlanet(gameEngine.planets[i]);
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
	var self = this;
	this.gameEngine = gameEngine;
	 

	this.refreshGameStatistics = function(){
		return new PlayerSummary();
	}


	/**
	 * Description
	 * @method desaster
	 * @return 
	 */
	this.interPlanetaryEvents = new interPlanetaryEvents(gameEngine);

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
			if (this.isEnemy(currentPlanet.player, planet) && planet.units>0) return planet;
		};
	}

	/**
	 * Description
	 * @method nextPlayerPlanet
	 * @return 
	 */
	this.nextPlayerPlanet = function() {

		if (currentPlayerIndex+1 === this.gameEngine.planets.length-1) currentPlayerIndex = 1;
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
		if (source){
			var target = this.weakestEnemy(source);
			document.title = source.player.name + "->" + target.player.name;
			if (!source.flyto(target, source.units/2)) {
				gameEngine.computer.interPlanetaryEvents.execute();
			};
		} else {
				gameEngine.computer.interPlanetaryEvents.execute();
		}
	}

	window.setInterval(function  () {
		 self.play();
	}, 10000);

	return this;
}
