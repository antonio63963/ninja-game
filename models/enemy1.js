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
    createLifeIndicator: function() {
      if(!this) return; 
      ctx.fillStyle = 'rgb(228,19,107)';
      //x, y, w, h
      ctx.fillRect(this.x + 60, this.y - 20, 100, 10);
      ctx.fillStyle = 'rgb(29,113,98)';
      ctx.fillRect(this.x + 60, this.y - 20, this.life ?? 0, 10);
      ctx.font = "24px sans-serif";
      ctx.fillText(this.life, this.x + 60, this.y -24);
    }
  };
}
