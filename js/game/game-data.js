var initializeViewData = function(){

	planets.push(new Planet({
		id : 0,
		parent: 0,
		emissive:13750737,
		surfaceTexture:'sunmap.jpg',
		distance:0,
		yearInDays:0,
		size:(1392000),
		isSun:true 
	}));
	planets.push(new Planet({
		id : 1,
		parent: 0,
		surfaceTexture:'mercurymap.jpg',
		distance: 57.9,
		yearInDays:87.97,
		size:(4878 ) 
	}));
	planets.push(new Planet({
		id : 2,
		parent: 0,
		surfaceTexture:'venusmap.jpg',
		distance: 108.2,
		yearInDays:224.70,
		size:(12104)
	}));
	planets.push(new Planet({
		id : 3,
		parent: 0,
		surfaceTexture:'earth-day.jpg',
		yearInDays:365.26 ,
		distance: 149.6,
		size:(12756)
	}));
	planets.push(new Planet({
		id : 4,
		parent: 0,
		surfaceTexture:'mars_1k_color.jpg',
		yearInDays:686.98  ,
		distance: 227.9,
		size:(6787 )
	}));
	planets.push(new Planet({
		id : 5,
		parent: 0,
		surfaceTexture:'jupitermap.jpg',
		yearInDays:11.86*365,
		distance: 778.3,
		size:(142754  )
	})); 
}