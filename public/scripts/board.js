var Board = (function() {
	function constructor(canvasId) {
		this.canvas = document.getElementById(canvasId);
		this.context = this.canvas.getContext('2d');
		this.sprites = [];
	}
	
	constructor.prototype = {
		draw: function () {
			var that = this;
			var ctx = this.context;
			
			ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
			this.sprites.forEach(function(sprite) { 
				ctx.save();
				sprite.draw(ctx);
				sprite.update(that);
				ctx.restore();
			});
		},
		addSprite: function(sprite) {
			this.sprites.push(sprite);
		},
		removeSprite: function(sprite) {
			this.sprites = this.sprites.filter(function(val) { return val != sprite; }); 
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
			sprite.position = { x:0, y:0};
			return sprite;
		},
		rotating: function(sprite) {
			var old_draw = sprite.draw;
			
			sprite.draw = function(context) {
				context.rotate(this.angle);
				old_draw.apply(this, arguments);
			};
			sprite.angle = 0;
			return sprite;			
		},
		scaled: function(sprite) {
			var old_draw = sprite.draw;
			
			sprite.draw = function(context) {
				context.scale(this.scale, this.scale);
				old_draw.apply(this, arguments);
			};
			sprite.scale = 1.0;
			return sprite;			
		}
	}
})();