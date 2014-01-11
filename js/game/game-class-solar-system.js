var SolarSystem = function  (config) {
	
	this.planets = [];

	this.load = function(planets) {
		for (var i = 0; i < planets.length; i++) this.planets.push(new Planet(planets[i]));
		return this;
	};
 	
 	return this;
}