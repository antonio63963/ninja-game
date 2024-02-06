let isNewGame = AppStorage.getIsNewGame();
let isGameStarted = false;
let gameSpeed = 5;
let gameFrame = 0;

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const canvasWidth = (canvas.width = 1280);
const canvasHeight = (canvas.height = 720);

const ninjaImg = new Image();
ninjaImg.src = './assets/ninja_spriteTest.png';
let ninja = new Ninja();

const enemy1 = new Image();
enemy1.src = './assets/enemy1_states.png';
let enemies = [];
createTestEnemies();
function createTestEnemies() {
  enemies.push(new Enemy_model());
  const idxT = setTimeout(() => {
    enemies.push(new Enemy_model());
    clearTimeout(idxT);
  }, 3000);
}

const ninjaSurikens = new NinjaSurikens(enemies, (hittedEnemy) =>
  enemyExplouds.push(new ExploudInstance(hittedEnemy))
);

const exploudSeq = new Image();
exploudSeq.src = './assets/explose.png';

const bgImg = new Image();
bgImg.src = './assets/bg_long.jpg';

//splash screen
const splashScreen = new Image();
splashScreen.src = './assets/splash_screen.jpg';
const getStartedButton = Components.Button(ctx, 'Get Started', 60, 450);
//game over screen
const gameOverScreen = new Image();
gameOverScreen.src = './assets/game_over.jpg';
const withBeginButton = Components.Button(
  ctx,
  'With Begin',
  canvasWidth / 3 - 125,
  550
);
const tryAgainButton = Components.Button(
  ctx,
  'Try Again',
  canvasWidth / 2 + 125,
  550
);

const surikenImg = new Image();
surikenImg.src = './assets/suriken.svg';
const bg = {
  x: 0,
  y: 0,
};

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

  if (dataX < -2560) {
    bg.x = -2560;
    bgSpeed = null;
    if (ninja.x < 900) {
      ninja.x += delta;
    }
    return;
  }
  bg.x = dataX;
  bgSpeed = delta;
}
function moveBG_back(customerMove) {
  if (bg.x == 0) return;
  const delta = customerMove ? gameSpeed * customerMove : gameSpeed;
  const dataX = bg.x - delta;
  if (ninja.x > 200) {
    ninja.x -= gameSpeed;
  }
  if (dataX >= 0) {
    bg.x = 0;
    bgSpeed = null;
    return;
  }
  bg.x += gameSpeed;
  bgSpeed = -gameSpeed;
}

// ANIMATE
function animate() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  if (isGameStarted) {
    ctx.drawImage(bgImg, bg.x, bg.y, canvasWidth * 3, canvasHeight);
    if (bg.x < -canvasWidth * 3) {
      console.log('GAP');
      bg.x = canvasWidth;
    }

    //Enemy
    if (enemies.length) {
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
        if (
          spaceBetweenNinja < 150 &&
          spaceBetweenNinja > 50 &&
          ninja.frameY != 6 &&
          ninja.x < enemy.x
        ) {
          ninja.life -= 0.5;
          ninja.isHit = !ninja.isHit;
        }
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
    } else {
      createTestEnemies();
    }

    if (!ninja.isHit && ninja.life > 0) {
      ninja.createLifeIndicator();
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
    }
    if (ninja.life <= 0) {
      isGameStarted = false;
      AppStorage.setNewGame();
      location.reload();
    }
    if (ninja.isHit) {
      ninja.isHit = false;
    }

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
  } else {
    if (isNewGame) {
      ctx.drawImage(gameOverScreen, 0, 0, canvasWidth, canvasHeight);
      tryAgainButton.draw();
      withBeginButton.draw();
    } else {
      ctx.drawImage(splashScreen, 0, 0, canvasWidth, canvasHeight);
      getStartedButton.draw();
    }
  }
  requestAnimationFrame(animate);
}

animate();

// Splash Screen
const onStartGame = (e) => {
  if (getStartedButton.checkPosition(e.offsetX, e.offsetY)) {
    isGameStarted = true;
    canvas.removeEventListener('click', onStartGame);
    canvas.removeEventListener('mousemove', onHoverStartGame);
  }
};

const onHoverStartGame = (e) => {
  getStartedButton.state = getStartedButton.checkPosition(e.offsetX, e.offsetY)
    ? 'hover'
    : 'default';
};

canvas.addEventListener('click', onStartGame);
canvas.addEventListener('mousemove', onHoverStartGame);

// GameOver Screen
const onTryAgainButton = (e) => {
  if (tryAgainButton.checkPosition(e.offsetX, e.offsetY)) {
    isNewGame = false;
    isGameStarted = true;
    AppStorage.setNoNewGame();
    removeListenersGameOverScreen();
  }
};

const onWithBeginButton = (e) => {
  if (withBeginButton.checkPosition(e.offsetX, e.offsetY)) {
    AppStorage.clear();
    location.reload();
    removeListenersGameOverScreen();
  }
};

const onHoverTryAgain = (e) => {
  tryAgainButton.state = tryAgainButton.checkPosition(e.offsetX, e.offsetY)
    ? 'hover'
    : 'default';
};
const onHoverWithBegin = (e) => {
  withBeginButton.state = withBeginButton.checkPosition(e.offsetX, e.offsetY)
    ? 'hover'
    : 'default';
};

canvas.addEventListener('click', onTryAgainButton);
canvas.addEventListener('mousemove', onHoverTryAgain);
canvas.addEventListener('click', onWithBeginButton);
canvas.addEventListener('mousemove', onHoverWithBegin);

function removeListenersGameOverScreen() {
  canvas.removeEventListener('click', onTryAgainButton);
  canvas.removeEventListener('mousemove', onHoverTryAgain);
  canvas.removeEventListener('click', onWithBeginButton);
  canvas.removeEventListener('mousemove', onHoverWithBegin);
}

// Game
window.addEventListener('keydown', (e) => {
  console.log(e?.keyCode);
  ninja.keyHandler(e, ninjaSurikens.addNewSuriken);
});
window.addEventListener('mousedown', (e) =>
  ninja.keyHandler(e, ninjaSurikens.addNewSuriken)
);
window.addEventListener('keyup', (e) => ninja.onKeyUp(e));
window.addEventListener('mouseup', (e) => ninja.onMouseUp(e));
