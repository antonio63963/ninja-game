//suriken
function NinjaSurikens(enemies) {
  this.surikenArr = [];

  this.addNewSuriken = () => {
    const newSuriken = new SurikenInstance(enemies);
    console.log(this);
    this.surikenArr.push(newSuriken);
  };

  this.animateSurikens = function () {
    if (this.surikenArr.length) {
      this.surikenArr.forEach((sur, ind) => {
        if (sur.isExist) {
          sur.surikenLaunch();
        } else {
          this.surikenArr.splice(ind, 1);
        }
      });
    }
  };
}

function SurikenInstance(enemies) {
  this.derection = ninja.derection;
  this.isExist = true;
  (this.x = this.derection == 'left' ? ninja.x + 280 : ninja.x + 100),
    (this.y = ninja.y + 190),
    (this.sizeX = 20),
    (this.sizeY = 20),
    (this.surikenLaunch = function () {
      if (this.derection == 'left' && this.isExist) {
        ctx.drawImage(surikenImg, this.x, this.y, this.sizeX, this.sizeY);
        this.x += 10;
        let hittedEnemyIdx;
        let hittedEnemy = enemies.find(
          (e, idx) => Math.abs(e.x - this.x) < 10
        );
        if (this.x > canvasWidth) {
          this.isExist = false;
          this.x = ninja.x + 280;
        }
        if(hittedEnemy) {
          console.log('SURICAN HIT', hittedEnemy);
          hittedEnemy.isHit = true;
          hittedEnemy.exploud = true;
          hittedEnemy.life -= 10;
          this.isExist = false;
        }
      }
      if (this.derection == 'right') {
        ctx.drawImage(surikenImg, this.x, this.y, this.sizeX, this.sizeY);
        this.x -= 10;
        if (this.x < 0) {
          this.isExist = false;
          this.x = ninja.x + 280;
        }
      }
    });
}
