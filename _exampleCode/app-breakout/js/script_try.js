
/*
function ObserverList(){
  this.observerList = [];
}
ObserverList.prototype.add = function( obj ){
  return this.observerList.push( obj );
};
ObserverList.prototype.count = function(){
  return this.observerList.length;
};

ObserverList.prototype.get = function( index ){
  if( index > -1 && index < this.observerList.length ){
    return this.observerList[ index ];
  }
};
*/

function Player(){

  var self = this,
    keys = {
      left: false,
      right: false,
      up: false,
      down: false
    },
    stage = new Stage({map: 0});

  (function() {

    document.addEventListener('keydown', self.handlerDownEvent, false);
    document.addEventListener('keyup', self.handlerUpEvent, false);

    self.stage.draw();

  })();

  return this;
}
Player.prototype.handlerDownEvent = function(e){
  console.log(this);
  if( e.keyCode == 39 ) {
    this.key.left = true;
  } else if( e.keyCode == 37 ) {
    this.key.right = true;
  } else if ( e.keyCode == 38 ) {
    this.key.up = true;
  } else if ( e.keyCode == 40 ) {
    this.key.down = true;
  }
};
Player.prototype.handlerUpEvent = function(e){
  if( e.keyCode == 39 ) {
    this.key.left = false;
  } else if( e.keyCode == 37 ) {
    this.key.right = false;
  } else if ( e.keyCode == 38 ) {
    this.key.up = false;
  } else if ( e.keyCode == 40 ) {
    this.key.down = false;
  }
};
Player.prototype.move = function () {

  if (this.key.left && game.handler.x + game.handler.w + game.handler.speed < game.canvas.width) {
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
  }

};

var _Maps = [
  [
    [0,1,1,1,0],
    [1,1,0,1,1],
    [0,0,1,0,0],
    [1,1,0,1,1],
    [0,1,1,1,0],
  ]
];


function Stage(params) {

  var self = this,
    opt = params,
    canvas = undefined,
    active = undefined,
    brick = {
      anz: 0,
      w: 0,
      h: 0,
      vSpace: 10,
      vStart: 40
    };


    if (!opt.map) {
      return false;
    }

    var map = _Maps[index];
    if (!map) {
      return false;
    }
    self.brick.anz = 0;
    var c = (self.canvas.width - (self.brick.w *5)) / 6;
    map.forEach(function (row, i) {
      self.active[i] = [];
      var y =  ((i+1)*(self.brick.h + self.brick.vSpace)) + game.brick.vStart;
      row.forEach(function (brick, j) {
        if (brick) {
          var x = (( c + self.brick.w ) * j ) + c;
          self.active[i][j] = {x: x, y: y, status: true};
          self.brick.anz++;
        }
      });
    });

}

Stage.prototype.draw = function () {
};

Stage.prototype.renderMap = function () {


  game.activeMap.forEach(function (row, i) {

    row.forEach(function (brick, j) {
      if (brick.status) {
        game.renderRect(brick.x, brick.y, game.brick.w, game.brick.h, '#0095DD');
      }
    });
  });
};

Stage.prototype.renderRect = function (x, y, w, h, hex) {

  game.ctx.beginPath();
  game.ctx.rect(x, y, w, h);
  game.ctx.fillStyle = hex || '#ccc';
  game.ctx.fill();
  game.ctx.closePath();

};

Stage.prototype.renderBall = function (x, y, r, a, e) {

  game.ctx.beginPath();
  game.ctx.arc(x, y, r, a, e);
  game.ctx.fillStyle = "#0095DD"
  game.ctx.fill();
  game.ctx.closePath();

};



var me = new Player();

/*

function Game(){
  var self = this;
  (function init() {
    self.players = new ObserverList();
  })();
}
Game.prototype.addPlayer = function( obj ){
  this.players.add( new Player({
    handler: true
  }) );
};
Game.prototype.loop = function( context ){
  var observerCount = this.players.count();
  for(var i=0; i < observerCount; i++){
    console.log( this.players.get(i) );
    // this.players.get(i).update( function (data) {
    //   console.log(data);
    // } );
  }
};

var myGame = new Game();
console.log(myGame);

myGame.addPlayer();
myGame.notify('blubb');

*/
