var GAMEDATA = [
	{
		id : 0,
		parent: 0,
		emissive:13750737,
		surfaceTexture:'sunmap.jpg',
		distance:0,
		yearInDays:0,
		size:(1392000),
		isSun:true 
	}
];
 
var ___id = 0;
var ___distance = 20;
/**
 * Description
 * @method randomPlanetMeta
 * @return ObjectExpression
 */
var randomPlanetMeta = function  () {
	var prevPlanet = GAMEDATA[0]
	___id++;
	___distance += (prevPlanet.size/100000) + Math.floor(Math.random()*100)+10;
	return	{
		id : ___id,
		parent: 0,
		surfaceTexture:'mercurymap.jpg',
		distance: ___distance,
		yearInDays:Math.floor(Math.random()*1000)+200,
		size:(Math.floor(Math.random()*150000)+2) 
	}
}

for (var i = 0; i < 15; i++) {
	GAMEDATA.push(randomPlanetMeta());
};