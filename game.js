// const game = {
//   start() {
//     this.ctx = document.getElementById('myCanvas')
//       .getContext('2d');
//     console.log(this.ctx);
//     let bg = new Image();
//     bg.src = './assets/ninja-stand-still.png';
//     this.ctx.drawImage(bg, 300, 300)
//     console.log('game started');
//   }
// }

// window.addEventListener('load', () => game.start())

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
 canvas.width = 1280;
 canvas.height = 720;

let keys = [];
let gameFrame = 0;
const  player = {
  x: 200, //start coordinates sprite sheet
  y: 380, 
  width: 400,//frame width
  height: 300, //frame height
  frameX: 0,
  frameY: 0,
  speed: 5,
  moving: false,
  stop: true,
}

const ninja = new Image();
ninja.src = './assets/ninja_sprite.png';
const bg = new Image();
bg.src = './assets/bg-start.jpg';

function drawNinja(img, sX, sY, sW, sH, dX, dY, dW, dH) {
  ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH)
}

function animate() { 
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
  drawNinja(ninja, player.frameX * player.width, player.frameY * player.height, player.width, player.height, player.x, player.y, player.width, player.height);
  movePlayer();
  changeSpriteFrame();
  gameFrame++;
  requestAnimationFrame(animate)
}
animate();


//===============KEY EVENTS===================
document.addEventListener('keydown', (event) => {
  keys[event.keyCode] = true;
  player.moving = true;
  console.log(event.keyCode);
})
document.addEventListener('keyup', (event) => {
  delete keys[event.keyCode];
  player.moving = false;
});
document.addEventListener('mousedown', (event) => {
  keys[event.which] = true;
})
document.addEventListener('mouseup', (event) => {
  delete keys[event.which];
})

function movePlayer() {
  if(keys[68]) {
    player.x += player.speed;
    player.frameY = 1;
    player.speed = 10;
    player.moving = true;
   
  };
  if(keys[65]) {
    player.x -= player.speed;
    player.frameY = 2;
    player.speed = 5;
    player.moving = true;
  };

  if(keys[65]) {
    player.x -= player.speed; 
  }
  if(keys[32] && player.y > 200) { 
    console.log(player.y); 
    player.y -= 50;
    setTimeout(() => player.y += 50, 200)
  }
  if(keys[1]) { 
    player.frameY = 3;
  }
 
}

function changeSpriteFrame() {
  if( gameFrame%2 == 0) {

    if(player.frameX < 9 ) {player.frameX++;}
    else if(!player.moving) {
      player.frameY = 0;
      player.moving = true;
    }
    else {
      player.frameX = 0;
    }
  }
}

