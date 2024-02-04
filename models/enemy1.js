const enemy1 = new Image();
enemy1.src = './assets/enemy1_states.png';

function Enemy_model() {
  return {
    x: canvasWidth,
  y: 430,
  width: 200,
  height: 200,
  life: 100,
  isHit: false,
  exploud: false,
  frameX: 0,
  state: function () {
    if (this.life > 80) {
      this.frameX = 0;
    } else if (this.life <= 80 && this.life > 50) {
      this.frameX = 1;
    } else if (this.life <= 50 && this.life > 30) {
      this.frameX = 2;
    } else {
      this.frameX = 3;
    }
  },
  }
};