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
		},
		collision: function(board, otherSprite) {
			otherSprite.collisionBullet && otherSprite.collisionBullet(board, this);
		}
	};

	return constructor;	
})();

var Stone = (function() {
	function constructor() {
		SpriteUtils.translated(this);
		
		this.size = 30;
		var angle = Math.random()*2*Math.PI
		this.moveVector = { x: Math.cos(angle), y: Math.sin(angle)};
	};
	
	constructor.prototype = {
		draw: function (ctx) {
			ctx.strokeStyle="#FF0000";
			ctx.beginPath();
			ctx.arc(0,0,this.size,0,2*Math.PI);
			ctx.stroke();			
		},
		update: function (board) {
			this.position.x += this.moveVector.x;
			this.position.y += this.moveVector.y; 
		}
		// collisionBullet: function (board, bullet) {
		// 	var distance = Math.sqrt(Math.pow(this.position.x - bullet.position.x, 2) + Math.pow(this.position.y - bullet.position.y, 2));
		// 	
		// 	if (distance < this.size + 3) {
		// 		board.removeSprite(this);
		// 		board.removeSprite(bullet);
		// 		
		// 		var stone1 = new Stone();
		// 		var stone2 = new Stone();
		// 		stone1.position.x = this.position.x - this.size/2;
		// 		stone1.position.y = this.position.y;
		// 		stone2.position.x = this.position.x + this.size/2;
		// 		stone2.position.y = this.position.y;
		// 		stone1.angle = 
		// 		
		// 		board.addSprite()
		// 	}
	};
	
	return constructor;
})();

function GameController($scope) {
	var board = new Board('gameCanvas');
	board.addSprite(ship);
	var stone = new Stone();
	stone.position = {x:100, y:100};
	board.addSprite(stone);
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