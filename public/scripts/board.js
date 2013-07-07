var Board = (function() {
	function constructor(canvasId) {
		this.canvas = document.getElementById(canvasId);
		this.context = this.canvas.getContext('2d');

		this.context.moveToVec = function(v) {
			this.moveTo(v.x, -v.y);
		};
		this.context.lineToVec = function(v) {
			this.lineTo(v.x, -v.y);
		};

		this.sprites = [];
	}
	
	constructor.prototype = {
		draw: function () {
			var that = this;
			var ctx = this.context;
			
			ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
			this.sprites.forEach(function(sprite) { 
				if (!sprite) return;
				
				ctx.save();
				sprite.draw && sprite.draw(ctx);
				sprite.update && sprite.update(that);
				sprite.collision && that.sprites.forEach(function(otherSprite) { 
					sprite.collision(that, otherSprite);
				});
				ctx.restore();
			});
		},
		addSprite: function(sprite) {
			this.sprites.push(sprite);
		},
		removeSprite: function(sprite) {
			this.sprites = this.sprites.filter(function(val) { return val != sprite; }); 
		},
		clear: function() {
			this.sprites = [];
		}
	};
	
	return constructor;
})();

var SpriteUtils = (function() {
	return {
		translated: function(sprite) {
			var old_draw = sprite.draw;
			
			sprite.draw = function(context) {
				context.translate(this.position.x, this.position.y);
				old_draw.apply(this, arguments);
			};
			sprite.position = new Vector(0, 0);
			return sprite;
		},
		rotating: function(sprite) {
			var old_draw = sprite.draw;
			
			sprite.draw = function(context) {
				context.rotate(this.angle);
				old_draw.apply(this, arguments);
			};
			sprite.angle = sprite.angle || 0;
			return sprite;			
		},
		scaled: function(sprite) {
			var old_draw = sprite.draw;
			
			sprite.draw = function(context) {
				context.scale(this.scale, this.scale);
				old_draw.apply(this, arguments);
			};
			sprite.scale = sprite.scale || 1.0;
			return sprite;			
		}
	}
})();

var Vector = (function() {
	function constructor(x, y) {
		if (y !== undefined) {
			this.x = x;
			this.y = y;
		} else {
			this.x = Math.cos(x);
			this.y = Math.sin(x);
		}
	}
	
	constructor.prototype = {
		add: function(v) {
			return new Vector(this.x + v.x, this.y + v.y);
		},
		distance: function(v) {
			var n1 = this.x - v.x
				 ,n2 = this.y - v.y;
			return Math.sqrt(n1*n1+n2*n2);
		},
		scale: function(a) {
			return new Vector(a*this.x, a*this.y);
		},
		rotate: function(angle) {
			return new Vector(
				this.x*Math.cos(angle) + this.y*Math.sin(angle),
				-this.x*Math.sin(angle) + this.y*Math.cos(angle));
		}
	};
	
	return constructor;
})();