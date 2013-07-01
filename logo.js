function Board(context) {
	var sprites = [];
	
	var draw = function () {
		context.clearRect(0,0,640,480);
		context.strokeRect(0,0,640,400);
		sprites.forEach(function(sprite) { 
			sprite.draw();
			sprite.update();
		});
	};
	
	var addSprite = function(sprite) {
		sprites.push(sprite);
	};
	
	var removeSprite = function(sprite) {
		sprites = sprites.filter(function(val) { return val != sprite; });
	};
	
	return {
		context: context,
		draw: draw,
		addSprite: addSprite,
		removeSprite: removeSprite
	}	
}

function Sprite(board, draw_func, update_func) {
	var draw = function() {
		this.context.save();
		this.context.translate(this.position.x, this.position.y);
		this.context.rotate(this.angle);
		this.context.scale(this.scale, this.scale);
		draw_func.call(this);
		this.context.restore();		
	};
	
	var update = function() {
		update_func.call(this);
	};
	
	return {
		angle: 0.0,
		board: board,
		context: board.context,
		position: {
			x: 0.0,
			y: 0.0
		},
		scale: 1.0,
		draw: draw,
		update: update
	}
}

function Cross(board) {
	var draw_func = function() {
		var ctx = this.context;
	
		ctx.strokeStyle="#FF0000";
		ctx.beginPath();
		ctx.moveTo(-30,0);
		ctx.lineTo(30,0);
		ctx.moveTo(0,-30);
		ctx.lineTo(0,30);
		ctx.stroke();
	};
	
	var update_func = function() {
		this.angle+=0.1;	
	};

	return Sprite(board, draw_func, update_func);
};

function Square(board, k_start) {
	var k = k_start || 0.0;
	
	var draw_func = function() {
		var ctx = this.context;
	
		ctx.strokeStyle="#00FF00";
		ctx.strokeRect(-20,-20,40,40);		
	};
	
	var update_func = function() {
		this.angle+=0.1;
		this.scale = Math.cos(k+=0.02)+2.0;	
	};
	
	return Sprite(board, draw_func, update_func);
};

function Ship(board) {
	var draw_func = function() {
		var ctx = this.context;
	
		ctx.strokeStyle="#00FF00";
		ctx.beginPath();
		ctx.moveTo(0,20);
		ctx.lineTo(10,-10);
		ctx.lineTo(0,0);
		ctx.lineTo(-10,-10);
		ctx.lineTo(0,20);
		ctx.stroke();
	};
	
	var update_func = function() {
		if (this.angleDirection) {
			this.angle += this.angleDirection;
		}
		
		if (this.distanceSpeed) {
			var x = Math.cos(this.angle + Math.PI/2)*this.distanceSpeed;
			var y = Math.sin(this.angle + Math.PI/2)*this.distanceSpeed;
			
			this.position.x += x;
			this.position.y += y;
		}
	};

 	var sprite = Sprite(board, draw_func, update_func);
	sprite.distanceSpeed = 0;
	return sprite;
}

function Stone(board) {
	var size = 30;
	
	var draw_func = function() {
		var ctx = this.context;
	
		ctx.strokeStyle="#FF0000";
		ctx.beginPath();
		ctx.arc(0,0,size,0,2*Math.PI);
		ctx.stroke();
	};
	
	var update_func = function() {
	};

	var sprite = Sprite(board, draw_func, update_func);	
	sprite.position = {x: Math.random() * 640, y: Math.random() * 400};
	
	return sprite;
}


function Bullet(board) {
	var distance = 30;
	
	var draw_func = function() {
		var ctx = this.context;
	
		ctx.strokeStyle="#FF0000";
		ctx.beginPath();
		ctx.arc(0,distance,3,0,2*Math.PI);
		ctx.stroke();
	};
	
	var update_func = function() {
		distance+=5;
		if (distance > 200) {
			board.removeSprite(this);
		}
	};

	return Sprite(board, draw_func, update_func);	
}

function LogoController($scope) {
	var context = document.getElementById('canvas').getContext('2d');
	var board = Board(context);
	
	var ship = Ship(board);
	ship.position = {x: 320, y: 200};
	board.addSprite(ship);
	
	var shoot = function() {
		var bullet = Bullet(board);
		bullet.position = { x: ship.position.x, y: ship.position.y};
		bullet.angle = ship.angle;
		board.addSprite(bullet);	
	};
	
	for (var i = 0; i < 10; i++) {
		board.addSprite(Stone(board));
	}
	
	$scope.animation = function() {
		board.draw();
	};

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
			shoot();
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

	setInterval($scope.animation, 20);
}