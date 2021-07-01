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
// function actionNinja() {
//   // const key = ninja.keyMouse ? ninja.keyMouse : ninja.keyBoard;
//   const key = ninja.keyBoard
//   // console.log(key);
//   switch (key) {
//     case "KeyD":
//       ninja.frameY = 1;
//       ninja.frameX = 0;
//       ninja.gapFrame = 2;
//       ninja.amountFrames = 9;
//       ninja.infinity = true;
//       break;
//     case "KeyA":
//       ninja.frameY = 2;
//       ninja.frameX = 0;
//       ninja.gapFrame = 2;
//       ninja.amountFrames = 9;
//       ninja.infinity = true;
//       break;
//     case 1:
//       ninja.frameY = 3;
//       ninja.frameX = 0;
//       ninja.gapFrame = 2;
//       ninja.amountFrames = 5;
//       ninja.infinity = false;
//       break;
//     default:
//       ninja.frameY = 0;
//       // ninja.frameX = 0;
//       ninja.gapFrame = 3;
//       ninja.amountFrames = 9;
//       ninja.infinity = true;
   
//   }

// }

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
  if(actionArr[1]) {
    ninja.frameY = 3;
    ninja.gapFrame = 2;
    ninja.amountFrames = 5;
    ninja.infinity = false;
  }
};


function keyHandler(e) {

  if(!actionArr[e.which]) {
    actionArr[e.which] = true;
    ninja.frameX = 0;
    console.log(actionArr);
  }
}

animate();

window.addEventListener("keydown", keyHandler);
window.addEventListener("mousedown", keyHandler);
window.addEventListener('keyup', (e) => {
  delete actionArr[e.which];
  ninja.frameY = 0;
  ninja.gapFrame = 3;
  ninja.infinity = true;
  ninja.frameX = 0;
  ninja.amountFrames = 9;
});

window.addEventListener('mouseup', (e) => {
  delete actionArr[e.which];
  ninja.frameY = 0;
  ninja.gapFrame = 3;
  ninja.infinity = true;
  ninja.frameX = 0;
  ninja.amountFrames = 9;
  console.log('mouseup:  ', ninja.frameX, ninja.infinity);
});
