//suriken
function NinjaSurikens(enemies, addExploud) {
  this.surikenArr = [];

  this.addNewSuriken = () => {
    const newSuriken = new SurikenInstance(enemies, addExploud);
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

function SurikenInstance(enemies, addExploud) {
  this.checkIfSurikenHit = function () {
    let hittedEnemy = enemies.find((e) => Math.abs(e.x - this.x) < 20);
    if (this.x > canvasWidth) {
      this.isExist = false;
      this.x = ninja.x + 280;
    }
    if (hittedEnemy) {
      console.log('SURICAN HIT', hittedEnemy);
      hittedEnemy.isHit = true;
      hittedEnemy.exploud = true;
      hittedEnemy.life -= 10;
      addExploud(hittedEnemy);
      this.isExist = false;
    }
  };
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
        this.checkIfSurikenHit();
        // let hittedEnemy = enemies.find((e) => Math.abs(e.x - this.x) < 20);
        // if (this.x > canvasWidth) {
        //   this.isExist = false;
        //   this.x = ninja.x + 280;
        // }
        // if (hittedEnemy) {
        //   console.log('SURICAN HIT', hittedEnemy);
        //   hittedEnemy.isHit = true;
        //   hittedEnemy.exploud = true;
        //   hittedEnemy.life -= 10;
        //   addExploud(hittedEnemy);
        //   this.isExist = false;
        // }
      }
      if (this.derection == 'right') {
        ctx.drawImage(surikenImg, this.x, this.y, this.sizeX, this.sizeY);
        this.x -= 10;
        this.checkIfSurikenHit(this);
        if (this.x < 0) {
          this.isExist = false;
          this.x = ninja.x + 280;
        }
      }
    });
}
