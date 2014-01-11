/*!
 * Color JavaScript Library v1.0
 * http://ahlf-it.de/
 *
 * MIT / GPL licensed
 */
;(function(window, undefined) {
	var Color = function(colorValue) {

		this.random = function () {
		    var letters = '0123456789ABCDEF'.split('');
		    var color = '#';
		    for (var i = 0; i < 6; i++ ) {
		        color += letters[Math.round(Math.random() * 15)];
		    }
		    return new Color(color);
		}

		this.equal = function(color) {
			return ( this.r === color.r && this.g === color.g && this.b === color.b );
		};

		this.assignColor = function(color) {
			this.r = color.r;
			this.g = color.g;
			this.b = color.b;
			this.a = color.a;
			this.colorString = color.colorString || this.colorString;
			return this;
		};

		this.parseRGB = function(colorString) {

			if (colorString === "transparent")   colorString = "rgb(255, 255, 255)";
			var colorArray  = colorString.match (/\((\d+)\s?,\s?(\d+)\s?,\s?(\d+),?\s?((\.\d+|\d+\.\d+))?\)/);

			var result = colorArray ? {
				r: parseInt(colorArray[1], 10),
				g: parseInt(colorArray[2], 10),
				b: parseInt(colorArray[3], 10),
				a: parseFloat(colorArray[4])
			} : null;

			colorString = colorString.replace(/(\d+)/, "{r}");
			colorString = colorString.replace(/(\d+)/, "{g}");
			colorString = colorString.replace(/(\d+)/, "{b}");
			colorString = colorString.replace(/(\.\d+|\d+\.\d+)/, "{a}");
			this.colorString = colorString;
			return result;
		};

		this.getColorFromName = function(name) {
			var rgb,
			tmp = document.body.appendChild(document.createElement("div"));

			tmp.style.backgroundColor = name.toLowerCase();
			rgb = window.getComputedStyle(tmp, null).backgroundColor;
			this.colorString = rgb;
			var color = this.parseRGB(this.colorString);

			if (!color || !color.r || color.r===0 && color.g===0 && color.b===0 && this.colorString !== "black"){
				return null;
			} else {
				return color;
			}
		};

		this.normalizeHexValue = function(hex) {
			var res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			var result = null;
			if (res){
				result = hex;
			} else {
				result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec("#"+hex);
				if (result) result = "#" + hex;
			}
			return result;
		};

		this.hexToRgb = function (hex) {
			// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
			var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
			hex = hex.replace(shorthandRegex, function(m, r, g, b) {
				return r + r + g + g + b + b;
			});

			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
			} : null;
		};
		/*
		this.hexToRgbString = function (hex) {
			var result = this.hexToRgb(hex);
			return "rgb(" + result.r + "," + result.g + "," + result.b + ")";
		};*/

		this.componentToHex = function (c) {
			var hex = c.toString(16);
			return hex.length == 1 ? "0" + hex : hex;
		};

		this.hex = function() {
			return "#" + this.componentToHex(this.r) + this.componentToHex(this.g) + this.componentToHex(this.b);
		};


		this.invertGoodReadable = function() {
			var result = new Color("#ffffff");
			if (((this.r + this.b + this.g) / 3) > 128) {
				result.initializeBy("#000000");
			}
			return result;
		};

		this.lum = function(lum) {
			var hex = ColorLuminance(this.hex(), 0)
			hex = ColorLuminance(hex, lum);
			var newColor = new Color(hex);
			this.assignColor(newColor);
		};

		var ColorLuminance= function(hex, lum) {

			// validate hex string
			hex = String(hex).replace(/[^0-9a-f]/gi, '');
			if (hex.length < 6) {
				hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
			}
			lum = lum || 0;

			// convert to decimal and change luminosity
			var rgb = "#", c, i;
			for (i = 0; i < 3; i++) {
				c = parseInt(hex.substr(i*2,2), 16);
				c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
				rgb += ("00"+c).substr(c.length);
			}

			return rgb;
		}

		this.toString = function() {
			var rgbValueString = "" ;
			if (this.colorString){
				result = this.colorString;
				result = result.replace("{r}", this.r);
				result = result.replace("{g}", this.g);
				result = result.replace("{b}", this.b);
				result = result.replace("{a}", this.a);
				if (result.indexOf("rgb") === -1){
					if (this.a){
						result = "rgba" + result;
					} else {
						result = "rgb" + result;
					}
				}
			} else {
				if (this.a){
					result = "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
				} else {
					result = "rgb(" + this.r + "," + this.g + "," + this.b + ")";
				}
			}
			return result;
		};

		this.initializeByNativeColorType = function(c) {
			this.r = c.r;
			this.g = c.g;
			this.b = c.b;
			this.a = c.a;
			this.err = false;
		};

		this.initializeBy = function(colorValue) {
			var color = colorValue;
			if (color.r === undefined){
				// try to parse hexadecimal.
				color = this.normalizeHexValue(color);
				if (color === null){
					// try to parse rgb.
					color = this.parseRGB(colorValue);
					if (color === null){
						// try get color by name string
						color = this.getColorFromName(colorValue);
					}
				} else {
					// parse hex
					color = this.hexToRgb(color);
				}
			}
			if (color) this.initializeByNativeColorType(color);
		};
		this.err = true;
		this.initializeBy(colorValue);

		return this;
	};
 
	if ( typeof module === "object" && module && typeof module.exports === "object" ) {
		// Expose Color as module.exports in loaders that implement the Node
		// module pattern (including browserify). Do not create the global, since
		// the user will be storing it themselves locally, and globals are frowned
		// upon in the Node module world.
		module.exports = Color;
	} else {
		// Otherwise expose Color to the global object as usual
		window.Color = Color;

		// Register as a named AMD module, since Color can be concatenated with other
		// files that may use define, but not via a proper concatenation script that
		// understands anonymous AMD modules. A named AMD is safest and most robust
		// way to register. Lowercase "color" is used because AMD module names are
		// derived from file names, and Color is normally delivered in a lowercase
		// file name. Do this after creating the global so that if an AMD module wants
		// to call noConflict to hide this version of Color, it will work.
		if ( typeof define === "function" && define.amd ) {
			define( "color", [], function () { return Color; } );
		}
	}
})(window);