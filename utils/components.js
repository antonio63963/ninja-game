class Components {
  static topLifeIndicator(life) {
    if (!this) return;
    ctx.fillStyle = 'rgb(228,19,107)';
    //x, y, w, h
    ctx.fillRect(x + 60, y - 20, 100, 10);
    ctx.fillStyle = 'rgb(29,113,98)';
    ctx.fillRect(x + 60, y - 20, life ?? 0, 10);
    ctx.font = '24px sans-serif';
    ctx.fillText(life, x + 60, this.y - 24);
  }

  static Button(ctx, text, x, y) {
    return {
      x: x,
      y: y,
      w: 250,
      h: 62,
      state: 'default',
      draw: function () {
        ctx.font = 'bold 32px Sans-serif ';
        switch (this.state) {
          case 'hover':
            ctx.fillStyle = '#C3204B';
            ctx.fillRect(this.x, this.y, this.w, this.h); 
            ctx.fillStyle = 'white';
            ctx.fillText(
              'Go!!!!!!',
              this.x + this.w / 2 - ctx.measureText(text).width / 2,
              this.y + this.h / 2 + 10
            );
            break;
          default:
            ctx.fillStyle = '#233643';
            ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = 'white';
            ctx.fillText(
              text,
              this.x + this.w / 2 - ctx.measureText(text).width / 2,
              this.y + this.h / 2 + 10
            );
        }
      },
      checkPosition: function (x, y) {
        return (
          x >= this.x &&
          x <= this.x + this.w &&
          y >= this.y &&
          y <= this.y + this.h
        );
      }
    }
  }
}
