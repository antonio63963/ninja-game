const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const canvasWidth = (canvas.width = 1280);
const canvasHeight = (canvas.height = 720);

const ninjaImg = new Image();
ninjaImg.src = "./assets/ninja_spriteTest.png";
const bgImg = new Image();
bgImg.src = "./assets/bg-start.jpg";

const ninja = {
  x: 200,
  y: 370,
  width: 400,
  height: 300,
  frameX: 0,
  frameY: 0,
  amountFrames: 19,
  gapFrame: 3,
  infinity: true,// is this neccessary?
  howToRender: 'infinity',//'infinity', 'once', 'onceReverce' 
  derection: 'left'
};
let gameFrame = 0;

const actionArr = [];
let isClickFast = true;
let timer_isFast = 0;
function cleanUpTimer(id) {
  clearTimeout(id);
  showClickSpeed();//test
  isClickFast = true;
}

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
    if(ninja.howToRender == 'once') {
      console.log(ninja.frameX);
      shortPress(32);
    }
    if(ninja.infinity) {
      if(ninja.frameX < ninja.amountFrames) ninja.frameX++;
      else ninja.frameX = 0;
    }
    // else {
    //   if(ninja.frameX < ninja.amountFrames) ninja.frameX++;
    //   else ninja.frameX = 5;
    // }
  };

  gameFrame++;
  requestAnimationFrame(animate);
}


function actionNinja() {
  if(actionArr[68]) {
    ninja.frameY = 2;
    ninja.gapFrame = 2;
    ninja.amountFrames = 18;
    ninja.infinity = true;
    ninja.derection = 'left'
  }
  if(actionArr[65]) {
    ninja.frameY = 3;
    ninja.gapFrame = 2;
    ninja.amountFrames = 18;
    ninja.infinity = true;
    ninja.derection = 'right'
  }//block
  if(actionArr[3] && actionArr[68]) {
    ninja.frameY = 4;
    ninja.gapFrame = 2;
    ninja.amountFrames = 5;//????
    ninja.infinity = false;
    ninja.derection = 'left'
  }
  if(actionArr[3] && actionArr[65]) {
    ninja.derection = 'right'
    ninja.frameY = 5;
    ninja.gapFrame = 2;
    ninja.amountFrames = 5;
    ninja.infinity = false;
  }//fly weel
  if(actionArr[32] && actionArr[68]) {
    ninja.howToRender = 'once';
    ninja.derection = 'left'
    ninja.frameY = 6;
    ninja.gapFrame = 2;
    ninja.amountFrames = 9;
    ninja.infinity = false;
    ninja.y = 200;
    setTimeout(() => ninja.y = 370, 200)
  }
  if(actionArr[32] && actionArr[65]) {
    ninja.howToRender = 'once';
    ninja.derection = 'right'
    ninja.frameY = 7;
    ninja.gapFrame = 2;
    ninja.amountFrames = 9;
    ninja.infinity = false;
    ninja.y = 200;
    setTimeout(() => ninja.y = 370, 200)
  }
  else {
    if(ninja.derection == 'right') {
      ninja.frameY = 1;
      ninja.gapFrame = 3;
      ninja.infinity = true;
      ninja.frameX = 0;
      ninja.amountFrames = 18;
    }
    if(ninja.derection == 'left') {
      ninja.frameY = 0;
      ninja.gapFrame = 3;
      ninja.infinity = true;
      ninja.frameX = 0;
      ninja.amountFrames = 18;
    }
  }
};


function showClickSpeed() {
  // console.log('isClickFast: ', isClickFast);
  if(isClickFast) {console.log('click is fast');}
  else {console.log('click is slow');}
}

function keyHandler(e) {
  if(!actionArr[e.which]) {
    // timer_isFast = setTimeout(() => {
    //   isClickFast = false;
    // }, 200);
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

  cleanUpTimer(timer_isFast);
    if(actionArr[32]) {
      return false;
    }
    delete actionArr[e.which];
    ninja.frameY = 0;
    ninja.gapFrame = 3;
    ninja.infinity = true;
    ninja.frameX = 0;
    ninja.amountFrames = 18;
});

window.addEventListener('mouseup', (e) => {
  cleanUpTimer(timer_isFast);
    delete actionArr[e.which];
    ninja.frameY = 0;
    ninja.gapFrame = 3;
    ninja.infinity = true;
    ninja.frameX = 0;
    ninja.amountFrames = 18;
  
  // console.log('mouseup:  ', ninja.frameX, ninja.infinity);
});

function shortPress(eCode) {
  if(ninja.frameX < ninja.amountFrames) {
    ninja.frameX++;
    console.log(ninja.frameX);
  }
  else {
    console.log('full actionArr: ', actionArr.length);
    delete actionArr[eCode];
 
    actionArr.length = 0;
    ninja.frameY = 0;
    ninja.howToRender = 'infinity',
    ninja.frameX = 0;

    console.log('acitionArr: ', actionArr.length);
    return
  }
}


// ----------------------------------------------------------------
// if(!actionArr.length) {
//   ninja.frameX = 0;
//   ninja.frameY = 0;
// }

