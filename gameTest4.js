const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const canvasWidth = (canvas.width = 1280);
const canvasHeight = (canvas.height = 720);

const ninjaImg = new Image();
ninjaImg.src = "./assets/ninja_spriteTest.png";
const bgImg = new Image();
bgImg.src = "./assets/bg-start2.jpg";
const surikenImg = new Image();
surikenImg.src = "./assets/suriken.svg";
const bg = {
  x: 0,
  y: 0,
  
}
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

const eventArr = [];
let isClickFast = true;
let timer_isFast = 0;

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
const impactArr = [];

function animate() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  // ctx.drawImage(bgImg, 0, 0, canvasWidth, canvasHeight);
  ctx.drawImage(bgImg, bg.x, bg.y, canvasWidth, canvasHeight);
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

  controlEventArr();

  if(gameFrame % ninja.gapFrame == 0) {
    if(ninja.howToRender == 'once') {
      const ind = deleteIndex ? deleteIndex : ninja.stopListenKey;
      onceAnimation(ind)
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
        delete eventArr[ninja.stopListenKey];
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


function controlEventArr() {
  if(eventArr[68]) {
    ninja.frameY = 2;
    ninja.gapFrame = 2;
    ninja.amountFrames = 19;
    ninja.derection = 'left'
  }
  if(eventArr[65]) {
    ninja.frameY = 3;
    ninja.gapFrame = 2;
    ninja.amountFrames = 19;
    ninja.derection = 'right'
  }//block
  if(eventArr[3] && ninja.derection == 'left') {
    ninja.frameY = 4;
    ninja.gapFrame = 2;
    ninja.amountFrames = 19;     
  }
  if(eventArr[3] && ninja.derection == 'right') {
    ninja.frameY = 5;
    ninja.gapFrame = 2;
    ninja.amountFrames = 19;
  }//fly weel
  if(eventArr[32] && eventArr[68] || eventArr[32] && ninja.derection == 'left') {
    ninja.howToRender = 'once';
    ninja.frameY = 6;
    ninja.gapFrame = 2;
    ninja.amountFrames = 9;
    ninja.y = 200;
    setTimeout(() => ninja.y = 370, 200)
  }
  if(eventArr[32] && eventArr[65] || eventArr[32] && ninja.derection == 'right') {
    ninja.frameY = 7;
    ninja.gapFrame = 2;
    ninja.amountFrames = 9;
    ninja.y = 200;
    setTimeout(() => ninja.y = 370, 200)
  }
  // suriken
  if(eventArr[1]) {
    ninja.frameY = ninja.derection == 'right' ? 11 : 10;
    ninja.gapFrame = 2;
    ninja.amountFrames = 3;

  }
  if(eventArr[70]) {
    ninja.frameY = ninja.derection == 'right' ? 9 : 8;
    ninja.amountFrames = 19;//impactArr.length > 1 ? 13 : 19;
    ninja.gapFrame = 1;
  }
  if(eventArr[87] ) {
    ninja.howToRender = 'once';
    ninja.frameY = ninja.derection == 'right' ? 13 : 12;
    ninja.amountFrames = 19;
    ninja.gapFrame = 1;
    ninja.y = 280;
    setTimeout(() => ninja.y = 370, 200)
  }

};


function keyHandler(e) {
  console.log('down: ',e.which, 'eventArr: ', eventArr[e.which]);
  if(e.which == ninja.stopListenKey || eventArr[e.which]) return;
  if(!eventArr[e.which]) {
    eventArr[e.which] = true;
    ninja.frameX = 0;
    if(e.which == 32 || e.which == 1 || e.which == 70 || e.which == 87) {
      ninja.stopListenKey = e.which;
      ninja.howToRender = 'once';
    }  
    if(e.which == 3) {
      ninja.stopListenKey = e.which
      ninja.howToRender = 'stopAnimation';
    }
    if(e.which == 68 || e.which == 65) ninja.howToRender = 'infinity'
    if(e.which == 1) addNewSuriken();
  }
}

animate();

window.addEventListener("keydown", keyHandler);
window.addEventListener("mousedown", keyHandler);
window.addEventListener('keyup', (e) => {
console.log(e.which);
console.log('listen: ', ninja.stopListenKey);
console.log('del: ', deleteIndex);

  if(ninja.stopListenKey == 3) {
    ninja.howToRender = 'reverseAnimation';
    if( e.which == 68 || e.which == 65)
    delete  eventArr[e.which];
    return;
  }

  if(ninja.stopListenKey == 32 || ninja.stopListenKey == 70 || ninja.stopListenKey == 87) {
    deleteIndex = ninja.stopListenKey;
    ninja.stopListenKey = null;
    if(e.which == 68 || e.which == 65) delete eventArr[e.which];
    return false;
  }
  // if(deleteIndex == 70) return false;
  if(deleteIndex == 70 || deleteIndex == 87) {
    if(e.which == 68 || e.which == 65) delete eventArr[e.which];
    return false
  };

  defaultAnimation(e.which)
});

window.addEventListener('mouseup', (e) => {
  
  if(ninja.stopListenKey == 3 ) {
    ninja.howToRender = 'reverseAnimation';
    return; 
  }

  if(ninja.stopListenKey == 1) {
    ninja.stopListenKey = null;
    delete eventArr[1];
    return false;
  }
  defaultAnimation(e.which);
  console.log('exit up: ', eventArr);
});

function onceAnimation(eCode) {
  if(ninja.frameX < ninja.amountFrames) {
    ninja.frameX++;
  }
  else {
    defaultAnimation(eCode)
    deleteIndex = null;
  }
}
function defaultAnimation(eCode) {
  if(eCode) { //this validation allows to end "once" animation correct
    delete eventArr[eCode];
    ninja.frameY = ninja.derection == 'left' ? 0 : 1;
    ninja.amountFrames = 19;                                 
    ninja.frameX = 0;
    ninja.gapFrame = 3;
  }
}
