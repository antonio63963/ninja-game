const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const canvasWidth = (canvas.width = 1280);
const canvasHeight = (canvas.height = 720);

const ninjaImg = new Image();
ninjaImg.src = "./assets/ninja_sprite.png";
const bgImg = new Image();
bgImg.src = "./assets/bg-start.jpg";

const ninja = {
  x: 200,
  y: 370,
  width: 400,
  height: 300,
  frameX: 0,
  frameY: 0,
  amountFrames: 9,
  gapFrame: 3,
  infinity: true,
  keyMouse: null,
  keyBoard: null,

};
let gameFrame = 0;

const actionArr = [];
// let eventsKey = new Set();

function animate() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  ctx.drawImage(bgImg, 0, 0, canvasWidth, canvasHeight);
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



  actionNinja();

  if(gameFrame % ninja.gapFrame == 0) {
    if(ninja.infinity) {
      if(ninja.frameX < ninja.amountFrames) ninja.frameX++;
      else ninja.frameX = 0;
// console.log('simple:  ', ninja.infinity, ninja.frameX);
    }else {

      if(ninja.frameX < ninja.amountFrames) ninja.frameX++;
      else ninja.frameX = 5;
      // console.log('protection:  ', ninja.frameX);

    }
  };
  gameFrame++;
  requestAnimationFrame(animate);
}


function actionNinja() {
  if(actionArr[68]) {
    ninja.frameY = 1;
    ninja.gapFrame = 2;
    ninja.amountFrames = 9;
    ninja.infinity = true;
  }
  if(actionArr[65]) {
    ninja.frameY = 2;
    ninja.gapFrame = 2;
    ninja.amountFrames = 9;
    ninja.infinity = true;
  }
  if(actionArr[3] && actionArr[68]) {
    ninja.frameY = 3;
    ninja.gapFrame = 2;
    ninja.amountFrames = 5;
    ninja.infinity = false;
  }
  if(actionArr[3] && actionArr[65]) {
    ninja.frameY = 4;
    ninja.gapFrame = 2;
    ninja.amountFrames = 5;
    ninja.infinity = false;
  }
  if(actionArr[32] && actionArr[68]) {
    ninja.frameY = 6;
    ninja.gapFrame = 3;
    ninja.amountFrames = 5;
    ninja.infinity = true;
  }
};

let isClickFast = true;
let timer_id = 0;
function cleanUpTimer(id) {
  clearTimeout(id);
  isClickFast = true;
}
function showClickSpeed() {
  console.log('isClickFast: ', isClickFast);
  if(isClickFast) {console.log('click is fast');}
  else {console.log('click is slow');}
}

function keyHandler(e) {

if(!actionArr[e.which]) {
    timer_id = setTimeout(() => {
      isClickFast = false;
      console.log('setTimeout has done');
    }, 200);
    actionArr[e.which] = true;
    ninja.frameX = 0;
    // console.log('key + mouse ', actionArr[68],'----',actionArr[1]);
    // console.log('key + key ', actionArr[68],'----',actionArr[65]);
  }
}

animate();

window.addEventListener("keydown", keyHandler);
window.addEventListener("mousedown", keyHandler);
window.addEventListener('keyup', (e) => {

  cleanUpTimer(timer_id);
  delete actionArr[e.which];
  ninja.frameY = 0;
  ninja.gapFrame = 3;
  ninja.infinity = true;
  ninja.frameX = 0;
  ninja.amountFrames = 9;
});

window.addEventListener('mouseup', (e) => {
  cleanUpTimer(timer_id);
  delete actionArr[e.which];
  ninja.frameY = 0;
  ninja.gapFrame = 3;
  ninja.infinity = true;
  ninja.frameX = 0;
  ninja.amountFrames = 9;
  console.log('mouseup:  ', ninja.frameX, ninja.infinity);
});
