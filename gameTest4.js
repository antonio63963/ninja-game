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
  this.derection = ninja.derection;
  this.isExist = true;
  this.x = this.derection == 'left' ? ninja.x + 280 : ninja.x + 100,
  this.y = ninja.y + 190,
  this.sizeX = 20,
  this.sizeY = 20,
  this.surikenLaunch = function(){
    if(this.derection == 'left') {
    ctx.drawImage(surikenImg, this.x, this.y, this.sizeX, this.sizeY);
      this.x += 10;
      if(this.x > canvasWidth) {
        this.isExist = false;
        this.x = ninja.x + 280;
      }
    }
    if(this.derection == 'right') {
      ctx.drawImage(surikenImg, this.x, this.y, this.sizeX, this.sizeY);
      this.x -= 10;
      if(this.x < 0) {
        this.isExist = false;
        this.x = ninja.x + 280;
      }
    }
    
  }
};
function addNewSuriken() {
  const newSuriken = new SurikenInstance();
  surikenArr.push(newSuriken);
}

// defind the index to delete for 'once' animation
let deleteIndex = null;

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
      shortPress(deleteIndex);
    }
    if(ninja.howToRender == 'infinity') {
      if(ninja.frameX < ninja.amountFrames) ninja.frameX++;
      else ninja.frameX = 0;
    }
    if(ninja.howToRender == 'stopAnimation') {
      let framesToRender = Math.floor(ninja.amountFrames / 2);
      if(ninja.frameX < framesToRender) ninja.frameX++;
      else ninja.frameX = framesToRender;
    }
    if(ninja.howToRender == 'reverseAnimation') {
      if(ninja.frameX < ninja.amountFrames) {
        ninja.frameX++;
      }
      else {
        delete actionArr[ninja.stopListenKey];
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
    ninja.derection = 'left'
  }
  if(actionArr[65]) {
    ninja.frameY = 3;
    ninja.gapFrame = 2;
    ninja.amountFrames = 18;
    ninja.derection = 'right'
  }//block
  if(actionArr[3] && ninja.derection == 'left') {
    ninja.frameY = 4;
    ninja.gapFrame = 2;
    ninja.amountFrames = 19;
    
  }
  if(actionArr[3] && ninja.derection == 'right') {
    ninja.frameY = 5;
    ninja.gapFrame = 2;
    ninja.amountFrames = 19;
  }//fly weel
  if(actionArr[32] && actionArr[68] || actionArr[32] && ninja.derection == 'left') {
    ninja.frameY = 6;
    ninja.gapFrame = 2;
    ninja.amountFrames = 9;
    ninja.y = 200;
    setTimeout(() => ninja.y = 370, 200)
  }
  if(actionArr[32] && actionArr[65] || actionArr[32] && ninja.derection == 'right') {
    ninja.frameY = 7;
    ninja.gapFrame = 2;
    ninja.amountFrames = 9;
    ninja.y = 200;
    setTimeout(() => ninja.y = 370, 200)
  }
  // suriken
  if(actionArr[1]) {
    ninja.frameY = ninja.derection == 'right' ? 11 : 10;
    ninja.amountFrames = 5;

  }
  if(actionArr[70]) {
    ninja.frameY = ninja.derection == 'right' ? 9 : 8;
    ninja.amountFrames = 19;
    ninja.gapFrame = 2;
  }
 
};


function keyHandler(e) {
  // console.log(e.which);
  if(e.which == ninja.stopListenKey) return;
  if(!actionArr[e.which]) {
    actionArr[e.which] = true;
    ninja.frameX = 0;
    if(e.which == 32 || e.which == 1 || e.which == 70) {
      ninja.stopListenKey = e.which;
      ninja.howToRender = 'once';
    }  
    if(e.which == 3) {
      ninja.stopListenKey = e.which
      ninja.howToRender = 'stopAnimation';
    }
    if(e.which == 1) addNewSuriken();
  }
}

animate();

window.addEventListener("keydown", keyHandler);
window.addEventListener("mousedown", keyHandler);
window.addEventListener('keyup', (e) => {
  console.log(e.which);
  console.log(ninja.stopListenKey);
  if(ninja.stopListenKey == 3) {
    ninja.howToRender = 'reverseAnimation';
    if( e.which == 68 || e.which == 65)
    delete  actionArr[e.which];
    return;
  }
  if(ninja.stopListenKey == 32 || ninja.stopListenKey == 70) {
    deleteIndex = ninja.stopListenKey;
    ninja.stopListenKey = null;
    if(e.which == 68 || e.which == 65) delete actionArr[e.which];
    return false;
  }
  console.log(e.which);
  if( actionArr[32]) {
    delete actionArr[32];
  }
 
  delete actionArr[e.which];
  ninja.frameY = ninja.derection == 'left' ? 0 : 1;
  ninja.gapFrame = 3;
  ninja.howToRender = 'infinity';
  ninja.frameX = 0;
  ninja.amountFrames = 18;
  ninja.stopListenKey = null;
});

window.addEventListener('mouseup', (e) => {
  
  if(ninja.stopListenKey == 3 ) {
    ninja.howToRender = 'reverseAnimation';
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
console.log(deleteIndex, '======', actionArr[eCode]);
  }
}
