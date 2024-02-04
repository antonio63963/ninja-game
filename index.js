const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const canvasWidth = (canvas.width = 1280);
const canvasHeight = (canvas.height = 720);

const ninja = new Ninja();
const enemies = [new Enemy_model()];
const ninjaSurikens = new NinjaSurikens(enemies);

const exploudSeq = new Image();
exploudSeq.src = './assets/explose.png';

const bgImg = new Image();
bgImg.src = './assets/bg-start1.jpg';
const bgImg2 = new Image();
bgImg2.src = './assets/bg-start2.jpg';

//ENEMY
// const enemy_model = ;
// enemies.push(enemy_model);

let gameSpeed = 5;

const surikenImg = new Image();
surikenImg.src = './assets/suriken.svg';
const bg = {
  x: 0,
  y: 0,
};
const bg2 = {
  x: canvasWidth,
  y: 0,
};

let gameFrame = 0;

// const eventArr = [];
let isClickFast = true;
let timer_isFast = 0;

//exploud
const enemyExplouds = [];
function ExploudInstance() {
  this.frameX = 0;
  this.frameY = 0;
  this.amountFrames = 14;
  this.makeExploud = function (enemy_model) {
    console.log('EXPLOUDDD!!!!!');
    ctx.drawImage(
      exploudSeq,
      exp.frameX * 200,
      exp.frameY * 200,
      200,
      200,
      enemy_model.x,
      enemy_model.y,
      200,
      200
    );
  };
}
const exp = new ExploudInstance();

function moveBG_forward() {
  bg.x -= gameSpeed;
  bg2.x -= gameSpeed;
}
function moveBG_back() {
  if (bg.x == 0) return;
  bg.x += gameSpeed;
  bg2.x += gameSpeed;
}

function animate() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  ctx.drawImage(bgImg, bg.x, bg.y, canvasWidth, canvasHeight);
  if (bg.x == -canvasWidth) {
    console.log('GAP');
    bg.x = canvasWidth;
  }
  ctx.drawImage(bgImg2, bg2.x, bg.y, canvasWidth, canvasHeight);
  if (bg2.x == -canvasWidth) {
    bg2.x = canvasWidth;
  }

  // if(enemies.length) {
    enemies.forEach((enemy, idx) => {
      if(!enemy) return;
      if (!enemy.isHit && enemy.life > 0) {
        ctx.drawImage(
          enemy1,
          enemy.frameX * enemy.width,
          0,
          enemy.width,
          enemy.height,
          enemy.x,
          enemy.y,
          enemy.width,
          enemy.height
        );
      } else if(enemy.life == 0) {
        enemies.splice(idx, 1);
      };

      //stop enemy if get ninja
      if (Math.abs(enemy.x - ninja.x) > 150) {
        enemy.x -= 2;
      }
      if (enemy.isHit) {
        enemy.x += 15;
        enemy.isHit = false;
      }
      // on moving out of screen
      if (enemy.x < -200) {
        enemy.x = canvasWidth;
      }
      enemy.state();
      // remove
    })
  // }

  ctx.drawImage(
    ninjaImg,
    ninja.frameX * ninja.width,
    ninja.frameY * ninja.height,
    ninja.width,
    ninja.height,
    ninja.x,
    ninja.y,
    ninja.width,
    ninja.height
  );

  ninja.controlEventArr();

  if (gameFrame % ninja.gapFrame == 0) {
    if (ninja.howToRender == 'once') {
      const ind = ninja.deleteIndex ? ninja.deleteIndex : ninja.stopListenKey;
      ninja.onceAnimation(ind);
    }
    if (ninja.howToRender == 'infinity') {
      if (ninja.frameX < ninja.amountFrames) ninja.frameX++;
      else ninja.frameX = 0;
    }
    if (ninja.howToRender == 'stopAnimation') {
      let framesToRender = Math.floor(ninja.amountFrames / 2);
      if (ninja.frameX < framesToRender) ninja.frameX++;
      else ninja.frameX = framesToRender;
    }
    if (ninja.howToRender == 'reverseAnimation') {
      if (ninja.frameX < ninja.amountFrames) {
        ninja.frameX++;
      } else {
        delete ninja.eventArr[ninja.stopListenKey];
        ninja.frameY = ninja.derection == 'left' ? 0 : 1;
        ninja.stopListenKey = null;
        ninja.howToRender = 'infinity';
        ninja.gapFrame = 3;
        ninja.amountFrames = 19;
        ninja.frameX = 0;
      }
    }
  }

  // suriken
  ninjaSurikens.animateSurikens();

  gameFrame++;
  requestAnimationFrame(animate);
}

animate();

window.addEventListener('keydown', (e) => ninja.keyHandler(e, ninjaSurikens.addNewSuriken));
window.addEventListener('mousedown', (e) => ninja.keyHandler(e, ninjaSurikens.addNewSuriken));
window.addEventListener('keyup', (e) => ninja.onKeyUp(e));
window.addEventListener('mouseup', (e) => ninja.onMouseUp(e));
