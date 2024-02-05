let isStartedGame = false;

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const canvasWidth = (canvas.width = 1280);
const canvasHeight = (canvas.height = 720);

const ninja = new Ninja();
const enemies = [new Enemy_model()];
const ninjaSurikens = new NinjaSurikens(enemies, (hittedEnemy) =>
  enemyExplouds.push(new ExploudInstance(hittedEnemy))
);

const iT = setTimeout(() => enemies.push(new Enemy_model()), 2000);

const exploudSeq = new Image();
exploudSeq.src = './assets/explose.png';

const bgImg = new Image();
bgImg.src = './assets/bg_long.jpg';

const splashScreen = new Image();
splashScreen.src = './assets/splash_screen.jpg';

let gameSpeed = 5;

const surikenImg = new Image();
surikenImg.src = './assets/suriken.svg';
const bg = {
  x: 0,
  y: 0,
};

let gameFrame = 0;

let isClickFast = true;
let timer_isFast = 0;

//exploud
const enemyExplouds = [];
function ExploudInstance(enemy) {
  this.frameX = 0;
  this.frameY = 0;
  this.amountFrames = 14;
  this.makeExploud = function () {
    console.log('EXPLOUDDD!!!!!');
    ctx.drawImage(
      exploudSeq,
      this.frameX * 200,
      this.frameY * 200,
      200,
      200,
      enemy.x,
      enemy.y,
      200,
      200
    );
    this.frameX++;
  };
}

let bgSpeed = null;

function moveBG_forward(customerMove) {
  const delta = customerMove ? gameSpeed * customerMove : gameSpeed;
  const dataX = bg.x - delta;

  console.log(ninja.x)
  if ( dataX < -2560) {
    bg.x = -2560;
    bgSpeed = null;
    if(ninja.x < 900) {
      ninja.x += delta;
    }
    return;
  };
  bg.x = dataX;
  bgSpeed = delta;
}
function moveBG_back(customerMove) {
  console.log(ninja.x)
  if (bg.x == 0) return;
  const delta = customerMove ? gameSpeed * customerMove : gameSpeed;
  const dataX = bg.x - delta;
  if(ninja.x > 200) {
    ninja.x -= gameSpeed;
  }
  if ( dataX >= 0) {
    bg.x = 0;
    bgSpeed = null;
    return;
  };
  bg.x += gameSpeed;
  bgSpeed = -gameSpeed;
}

function animate() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  if (isStartedGame) {
    ctx.drawImage(bgImg, bg.x, bg.y, canvasWidth * 3, canvasHeight);
    if (bg.x < -canvasWidth * 3) {
      console.log('GAP');
      bg.x = canvasWidth;
    }

    //Enemy
    enemies.forEach((enemy, idx) => {
      if (!enemy) return;
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
        enemy.createLifeIndicator();
      } else if (enemy.life == 0) {
        enemies.splice(idx, 1);
      }

      const spaceBetweenNinja = Math.abs(enemy.x - ninja.x);
      //stop enemy if get ninja and reaction on impact
      // if (spaceBetweenNinja > 150) {
      // console.log("SPEED: ", bgSpeed)
      // console.log('Delta: ', delta)
      let delta = bgSpeed ? 2 + bgSpeed : 2;
      enemy.x -= delta;
      // }
      if (
        spaceBetweenNinja < 250 &&
        spaceBetweenNinja > 150 &&
        ninja.frameY == 12 &&
        ninja.frameX > 3 &&
        ninja.frameX < 12
      ) {
        enemy.x += 150;
        enemy.life -= 20;
      }

      if (enemy.isHit) {
        enemy.x += 15;
        enemy.isHit = false;
      }
      // on moving out of screen
      if (enemy.x < -200) {
        enemy.x = canvasWidth;
        enemy.life = 100;
      }
      enemy.state();
      if (idx == enemies.length - 1) {
        bgSpeed = null;
      }
    });

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

    if (enemyExplouds.length) {
      enemyExplouds.forEach((exp, idx) => {
        console.log(exp);
        if (exp.frameX >= exp.amountFrames) {
          console.log('Exp: ', exp.amount);
          enemyExplouds.splice(idx, 1);
          return;
        } else {
          exp.makeExploud();
        }
      });
    }

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
  } else {
    ctx.drawImage(splashScreen, bg.x, bg.y, canvasWidth, canvasHeight);
    requestAnimationFrame(animate);
  }
}

animate();

const onStartGame = (e) => {
  isStartedGame = true;
};

canvas.addEventListener('click', onStartGame);

window.addEventListener('keydown', (e) => {
  console.log(e?.keyCode);
  ninja.keyHandler(e, ninjaSurikens.addNewSuriken);
});
window.addEventListener('mousedown', (e) =>
  ninja.keyHandler(e, ninjaSurikens.addNewSuriken)
);
window.addEventListener('keyup', (e) => ninja.onKeyUp(e));
window.addEventListener('mouseup', (e) => ninja.onMouseUp(e));
