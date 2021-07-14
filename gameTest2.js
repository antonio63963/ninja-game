const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const canvasWidth = (canvas.width = 1280);
const canvasHeight = (canvas.height = 720);

const ninjaImg = new Image();
ninjaImg.src = "./assets/ninja_spriteTest.png";
const bgImg = new Image();
bgImg.src = "./assets/bg-start.jpg";
const surikenImg = new Image();
surikenImg.src = "./assets/suriken.svg";

const ninja = {
  x: 200,
  y: 370,
  width: 400,
  height: 300,
  frameX: 0,
  frameY: 0,
  amountFrames: 19,
  gapFrame: 3,
  howToRender: 'infinity',//'infinity', 'once', 'stopAnimation', 'reverseAnimation' 
  derection: 'left',
  stopListenKey: null
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
//suriken
const surikenArr = [];
function SurikenInstance() {
  this.isExist = true;
  this.x = ninja.x + 280,
  this.y = ninja.y + 190,
  this.sizeX = 20,
  this.sizeY = 20,
  this.surikenLaunch = function(){
    ctx.drawImage(surikenImg, this.x, this.y, this.sizeX, this.sizeY);
      this.x += 10;
      if(this.x > canvasWidth) {
        this.isExist = false;
        this.x = ninja.x + 280;
      }
  }
};
function addNewSuriken() {
  const newSuriken = new SurikenInstance();
  surikenArr.push(newSuriken);
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
      shortPress(32);
    }
    if(ninja.howToRender == 'infinity') {
      if(ninja.frameX < ninja.amountFrames) ninja.frameX++;
      else ninja.frameX = 0;
    }
    if(ninja.howToRender == 'stopAnimation') {
      let framesToRender = Math.floor(ninja.amountFrames / 2);
      console.log('amountFrames: ', ninja.amountFrames);
      console.log('88 : ', ninja.howToRender);
      if(ninja.frameX < framesToRender) ninja.frameX++;
      else ninja.frameX = framesToRender;
    }
    if(ninja.howToRender == 'reverseAnimation') {
      if(ninja.frameX < ninja.amountFrames) {
        ninja.frameX++;
      }
      else {
        console.log('check out the else');
        delete actionArr[ninja.stopListenKey];
        ninja.frameY = ninja.derection == 'left' ? 0 : 1;
        ninja.stopListenKey = null;
        ninja.howToRender = 'infinity';
        ninja.amountFrames = 19;
        ninja.frameX = 0;
      }
      console.log(ninja.stopListenKey, ninja.howToRender, actionArr);
    }
  }
    
    // suriken
    if(surikenArr.length) {
      surikenArr.forEach((sur, ind) => {
        if(sur.isExist) {
          sur.surikenLaunch();
        } else {surikenArr.splice(ind, 1);}
      });
    }
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
    ninja.howToRender = 'infinity';
    ninja.derection = 'right'
  }//block
  if(actionArr[3] && actionArr[68] || actionArr[3] && ninja.derection == 'left') {
    ninja.frameY = 4;
    ninja.gapFrame = 2;
    ninja.amountFrames = 19;//????
    
  }
  if(actionArr[3] && actionArr[65]) {
    ninja.derection = 'right'
    ninja.frameY = 5;
    ninja.gapFrame = 2;
    ninja.amountFrames = 5;
    ninja.infinity = false;
  }//fly weel
  if(actionArr[32] && actionArr[68] || actionArr[32] && ninja.derection == 'left') {
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
  if(actionArr[1]) {
    ninja.howToRender = 'once';
    ninja.stopListenKey = 1,
    ninja.frameY = 10;
  
    ninja.amountFrames = 5;
    ninja.infinity = false;
  }
};


function keyHandler(e) {
  
  if(e.which == ninja.stopListenKey) return;
  if(!actionArr[e.which]) {
    actionArr[e.which] = true;
    ninja.frameX = 0;
    if(e.which == 32 || e.which == 1 || e.which == 3) ninja.stopListenKey = e.which;
    if(e.which == 1) addNewSuriken();
    if(e.which == 3) ninja.howToRender = 'stopAnimation';
  }
}

animate();

window.addEventListener("keydown", keyHandler);
window.addEventListener("mousedown", keyHandler);
window.addEventListener('keyup', (e) => {
 
  if(ninja.stopListenKey == 32) {
    ninja.stopListenKey = null;
    if(e.which == 68 || e.which == 65) delete actionArr[e.which];
    return false;
  }
  if( actionArr[32]) {
    delete actionArr[32];
  }
    delete actionArr[e.which];
    ninja.frameY = ninja.derection == 'left' ? 0 : 1;
    ninja.gapFrame = 3;
    ninja.howToRender = 'infinity';
    ninja.frameX = 0;
    ninja.amountFrames = 18;
});

window.addEventListener('mouseup', (e) => {
  
  if(ninja.stopListenKey == 3) {
    ninja.howToRender = 'reverseAnimation';
    console.log('3 is up');
    console.log(ninja.howToRender);
    return;
  }
  if(ninja.stopListenKey == 1) {
    ninja.stopListenKey = null;
    delete actionArr[1];
    return false;
  }
    delete actionArr[e.which];
    ninja.frameY = 0
    ninja.gapFrame = 3;
    ninja.infinity = true;
    ninja.frameX = 0;
    ninja.amountFrames = 19;
});

function shortPress(eCode) {
  if(ninja.frameX < ninja.amountFrames) {
    ninja.frameX++;
  }
  else {
    delete actionArr[eCode];
    ninja.frameY = ninja.derection == 'left' ? 0 : 1;
    ninja.howToRender = 'infinity',
    ninja.amountFrames = 19,
    ninja.frameX = 0;

  }
}