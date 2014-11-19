/**
 * Description
 * @class SolarSystem
 * @constructor
 * @param {} config
 * @return ThisExpression
 */
var SolarSystem = function  (config) {
	
	this.planets = [];

	/**
	 * Description
	 * @method load
	 * @param {} planets
	 * @return ThisExpression
	 */
	this.load = function(planets) {
		for (var i = 0; i < planets.length; i++) this.planets.push(new Planet(planets[i]));
		return this;
	};
 	
 	return this;
};