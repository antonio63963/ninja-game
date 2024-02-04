const ninjaImg = new Image();
ninjaImg.src = './assets/ninja_spriteTest.png';

function Ninja() {
  return {
    x: 200,
    y: 370,
    width: 400,
    height: 300,
    frameX: 0,
    frameY: 0,
    amountFrames: 19,
    gapFrame: 3,
    howToRender: 'infinity', //'infinity', 'once', 'stopAnimation', 'reverseAnimation'
    derection: 'left',
    stopListenKey: null,

    // defind the index to delete for 'once' animation
    deleteIndex: null,

    eventArr: [],

    controlEventArr: function () {
      if (this.eventArr[68]) {
        this.frameY = 2;
        this.gapFrame = 2;
        this.amountFrames = 19;
        this.derection = 'left';
        moveBG_forward();
      }
      if (this.eventArr[65]) {
        this.frameY = 3;
        this.gapFrame = 2;
        this.amountFrames = 19;
        this.derection = 'right';
        moveBG_back();
      } //block
      if (this.eventArr[3] && this.derection == 'left') {
        this.frameY = 4;
        this.gapFrame = 2;
        this.amountFrames = 19;
      }
      if (this.eventArr[3] && this.derection == 'right') {
        this.frameY = 5;
        this.gapFrame = 2;
        this.amountFrames = 19;
      } //fly weel
      if (
        (this.eventArr[32] && this.eventArr[68]) ||
        (this.eventArr[32] && this.derection == 'left')
      ) {
        this.howToRender = 'once';
        this.frameY = 6;
        this.gapFrame = 2;
        this.amountFrames = 9;
        this.y = 200;
        this.jump();
      }
      if (
        (this.eventArr[32] && this.eventArr[65]) ||
        (this.eventArr[32] && this.derection == 'right')
      ) {
        this.frameY = 7;
        this.gapFrame = 2;
        this.amountFrames = 9;
        this.y = 200;
        this.jump();
      }
      // suriken
      if (this.eventArr[1]) {
        this.frameY = this.derection == 'right' ? 11 : 10;
        this.gapFrame = 2;
        this.amountFrames = 3;
      }
      if (this.eventArr[70]) {
        this.frameY = this.derection == 'right' ? 9 : 8;
        this.amountFrames = 19; //impactArr.length > 1 ? 13 : 19;
        this.gapFrame = 1;
      }
      if (this.eventArr[87]) {
        this.howToRender = 'once';
        this.frameY = this.derection == 'right' ? 13 : 12;
        this.amountFrames = 19;
        this.gapFrame = 1;
        this.y = 280;
        this.jump();
      }
    },

    keyHandler: function (e, addNewSuriken) {
      // console.log('down: ', e.which, 'eventArr: ', this.eventArr[e.which]);
      if (e.which == this.stopListenKey || this.eventArr[e.which]) return;
      if (!this.eventArr[e.which]) {
        this.eventArr[e.which] = true;
        this.frameX = 0;
        if (e.which == 32 || e.which == 1 || e.which == 70 || e.which == 87) {
          this.stopListenKey = e.which;
          this.howToRender = 'once';
        }
        if (e.which == 3) {
          this.stopListenKey = e.which;
          this.howToRender = 'stopAnimation';
        }
        if (e.which == 68 || e.which == 65) this.howToRender = 'infinity';
        if (e.which == 1) addNewSuriken();
      }
    },

    onKeyUp: function (e) {
      if (this.stopListenKey == 3) {
        this.howToRender = 'reverseAnimation';
        if (e.which == 68 || e.which == 65) delete this.eventArr[e.which];
        return;
      }

      if (
        this.stopListenKey == 32 ||
        this.stopListenKey == 70 ||
        this.stopListenKey == 87
      ) {
        this.deleteIndex = this.stopListenKey;
        this.stopListenKey = null;
        if (e.which == 68 || e.which == 65) delete this.eventArr[e.which];
        return false;
      }
      // if(deleteIndex == 70) return false;
      if (this.deleteIndex == 70 || this.deleteIndex == 87) {
        if (e.which == 68 || e.which == 65) delete this.eventArr[e.which];
        return false;
      }

      this.defaultAnimation(e.which);
    },

    onMouseUp: function (e) {
      if (this.stopListenKey == 3) {
        this.howToRender = 'reverseAnimation';
        return;
      }

      if (this.stopListenKey == 1) {
        this.stopListenKey = null;
        delete this.eventArr[1];
        return false;
      }
      this.defaultAnimation(e.which);
      console.log('exit up: ', this.eventArr);
    },

    //Utils
    onceAnimation: function (eCode) {
      if (this.frameX < this.amountFrames) {
        this.frameX++;
      } else {
        this.defaultAnimation(eCode);
        this.deleteIndex = null;
      }
    },

    jump: function () {
      const iT = setTimeout(() => {
        this.y = 370;
        clearTimeout(iT);
      }, 200);
    },

    defaultAnimation: function (eCode) {
      if (eCode) {
        //this validation allows to end "once" animation correct
        delete this.eventArr[eCode];
        this.frameY = this.derection == 'left' ? 0 : 1;
        this.amountFrames = 19;
        this.frameX = 0;
        this.gapFrame = 3;
      }
    },
  };
}
