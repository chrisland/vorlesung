
var game = {
  canvas: undefined,
  ctx: undefined,
  ball: {
    dx: 3,
    dy: 3,
    r: 10
  },
  handler: {
    y: 550,
    w: 150,
    h: 10,
    speed: 7
  },
  brick: {
    w: 100,
    h: 20,
    vSpace: 10,
    vStart: 100
  },
  score: 0,
  status: true,
  keyRight: undefined,
  keyLeft: undefined,
  activeMapIndex: 0,
  activeMap: [],
  maps: [
    [
      [0,1,1,1,0],
      [1,1,0,1,1],
      [0,0,1,0,0],
      [1,1,0,1,1],
      [0,1,1,1,0],
    ]
  ],
  init: function () {

    game.canvas = document.getElementById('stage');
    game.ctx = game.canvas.getContext("2d");

    game.ball.x = game.canvas.width / 2;
    game.ball.y = game.handler.y - game.ball.r;
    game.handler.x = (game.canvas.width - game.handler.w) / 2

    game.initMap(game.activeMapIndex);
    game.event();

    game.draw();

  },
  draw: function () {

    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);

    game.renderMap();

    game.moveHandler( function (color) {
      game.renderRect(game.handler.x, game.handler.y, game.handler.w, game.handler.h, color);
    });


    game.renderBall(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2);
    game.ball.x += game.ball.dx;
    game.ball.y += game.ball.dy;

    game.hit();

    if (game.status) {
      requestAnimationFrame(game.draw);
    }
  },
  hit: function () {

    if ( game.ball.y <= game.ball.r ) {
        //console.log('oben raus');
      game.ball.dy = -game.ball.dy;
    }
    if ( game.ball.x <= game.ball.r || game.ball.x >= game.canvas.width - game.ball.r ) {
      //console.log('seite raus');
      game.ball.dx = -game.ball.dx;
    }

    if ( game.ball.y >= game.canvas.height ) {

        game.status = false;
        //console.log('game over!');
        game.end();
    }

    if ( game.ball.y > game.handler.y - game.ball.r
        && game.ball.y <= game.handler.y
        && game.ball.x > game.handler.x
        && game.ball.x < game.handler.x + game.handler.w ) {
      //console.log('hit paddel!');
      game.ball.dy = -game.ball.dy;
    }

    game.activeMap.forEach(function (row) {
      row.forEach(function (brick) {


        if ( brick.status
          && game.ball.x > brick.x
          && game.ball.x  < brick.x + game.brick.w
          && game.ball.y   > brick.y
          && game.ball.y  < brick.y + game.brick.h
         ) {
           //console.log('hit brick!');
           brick.status = false;
           game.score++;
           if (game.brick.anz == game.score) {
             //console.log('YOU WIN !!!');
             game.win();
           }

        }
      });
    });


  },
  moveHandler: function (callback) {
    var color = '#ccc';
    if (game.keyLeft && game.handler.x + game.handler.w + game.handler.speed < game.canvas.width) {
      game.handler.x += game.handler.speed;
    } else if (game.keyRight && game.handler.x  - game.handler.speed > 0) {
      game.handler.x -= game.handler.speed;
    } else if (game.keyUp && game.handler.y > ((game.canvas.height/3)*2) ) {
      game.handler.y -= (game.handler.speed/2);
      game.handler.w -= 2;
      game.handler.x += 1;
    } else if (game.keyDown && game.handler.y < game.canvas.height - (game.handler.h *2)) {
      game.handler.y += (game.handler.speed/2);
      game.handler.w += 2;
      game.handler.x -= 1;
    } else {
      color = '#0095DD';
    }
    callback(color);
  },
  end: function () {

  },
  win: function () {

  },
  event: function () {
    document.addEventListener('keydown', game.handlerDownEvent, false);
    document.addEventListener('keyup', game.handlerUpEvent, false);
  },
  handlerDownEvent: function (e) {
    if( e.keyCode == 39 ) {
      game.keyLeft = true;
    } else if( e.keyCode == 37 ) {
      game.keyRight = true;
    } else if ( e.keyCode == 38 ) {
      game.keyUp = true;
    } else if ( e.keyCode == 40 ) {
      game.keyDown = true;
    }
  },
  handlerUpEvent: function (e) {
    if( e.keyCode == 39 ) {
      game.keyLeft = false;
    } else if( e.keyCode == 37 ) {
      game.keyRight = false;
    } else if ( e.keyCode == 38 ) {
      game.keyUp = false;
    } else if ( e.keyCode == 40 ) {
      game.keyDown = false;
    }
  },
  initMap: function (index) {
    var map = game.maps[index];
    if (!map) {
      return false;
    }
    game.brick.anz = 0;
    var c = (game.canvas.width - (game.brick.w *5)) / 6;
    map.forEach(function (row, i) {
      game.activeMap[i] = [];
      var y =  ((i+1)*(game.brick.h+game.brick.vSpace)) + game.brick.vStart;
      row.forEach(function (brick, j) {
        if (brick) {
          var x = (( c + game.brick.w ) * j ) + c;
          game.activeMap[i][j] = {x: x, y: y, status: true};
          game.brick.anz++;
        }
      });
    });
  },
  renderMap: function () {


    game.activeMap.forEach(function (row, i) {

      row.forEach(function (brick, j) {
        if (brick.status) {
          game.renderRect(brick.x, brick.y, game.brick.w, game.brick.h, '#0095DD');
        }
      });
    });
  },
  renderRect: function (x, y, w, h, hex) {

    game.ctx.beginPath();
    game.ctx.rect(x, y, w, h);
    game.ctx.fillStyle = hex || '#ccc';
    game.ctx.fill();
    game.ctx.closePath();

  },
  renderBall: function (x, y, r, a, e) {

    game.ctx.beginPath();
    game.ctx.arc(x, y, r, a, e);
    game.ctx.fillStyle = "#0095DD"
    game.ctx.fill();
    game.ctx.closePath();

  }
};


game.init();
