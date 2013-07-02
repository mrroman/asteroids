var ship = SpriteUtils.translated(SpriteUtils.rotating({
	distanceSpeed: 0,
	draw: function(ctx) {
		ctx.strokeStyle="#00FF00";
		ctx.beginPath();
		ctx.moveTo(0,20);
		ctx.lineTo(10,-10);
		ctx.lineTo(0,0);
		ctx.lineTo(-10,-10);
		ctx.lineTo(0,20);
		ctx.stroke();
	},
	update: function(board) {
		if (this.angleDirection) {
			this.angle += this.angleDirection;
		}
		
		if (this.distanceSpeed) {
			var x = Math.cos(this.angle + Math.PI/2)*this.distanceSpeed;
			var y = Math.sin(this.angle + Math.PI/2)*this.distanceSpeed;
			
			this.position.x += x;
			this.position.y += y;
		}
	},
	center: function(board) {
		this.position = {
			x: board.canvas.width/2-10,
			y: board.canvas.height/2-20
		};
	},
	shoot: function(board) {
		board.addSprite(new Bullet(this));
	}
}));

var Bullet = (function() {
	function constructor(ship) {
		SpriteUtils.translated(SpriteUtils.rotating(this));
		
		this.distance = 30;
		this.angle = ship.angle;
		this.position = { x: ship.position.x, y: ship.position.y };
	};
	
	constructor.prototype = {
		draw: function(ctx) {
			ctx.strokeStyle="#FF0000";
			ctx.beginPath();
			ctx.arc(0,this.distance,3,0,2*Math.PI);
			ctx.stroke();
		},
		update: function(board) {
			this.distance += 5;
			if (this.distance > 200) {
				board.removeSprite(this);
			}
		}		
	};

	return constructor;	
})();

var Stone = (function() {
	function constructor() {
		this.size = 30;
	};
	
	constructor.prototype = {
		draw: function (ctx) {
			ctx.strokeStyle="#FF0000";
			ctx.beginPath();
			ctx.arc(0,0,this.size,0,2*Math.PI);
			ctx.stroke();			
		},
		update: function (ctx) {
			
		}
	};
	
	return constructor;
})();

function GameController($scope) {
	var board = new Board('gameCanvas');
	board.addSprite(ship);
	board.addSprite(new Stone());
	ship.center(board);

	document.addEventListener('keydown', function(e) {
		switch(e.keyCode) {
		case 37:
			ship.angleDirection=-0.1;
			break;
		case 39:
			ship.angleDirection=0.1;
			break;
		case 38:
			ship.distanceSpeed += (ship.distanceSpeed < 4 ? 1 : 0);
			break;
		case 40:
			ship.distanceSpeed -= (ship.distanceSpeed > 1 ? 1 : 0);
			break;
		case 32:
			ship.shoot(board);
			break;
		}
	});
	
	document.addEventListener('keyup', function(e) {
		switch(e.keyCode) {
		case 37:
		case 39:
			ship.angleDirection=0;
			break;
		case 38:
		case 40:
			break;
		}		
	});

	setInterval(function() {
		board.draw();
	}, 20);
}