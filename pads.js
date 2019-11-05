export default class Pads {
  constructor(gameWidth, gameHeight) {
    var gW = gameWidth;
    var gH = gameHeight;

    var padNumb = 50;
    var buffer = 5;

    var padX = [];
    var padY = [];
    var bPadNumb = 5;
    var breakPads = [];
    var padW = 60;
    var broken = [];

    this.padX = padX;
    this.padY = padY;
    this.padW = padW;
    this.buffer = buffer;
    this.padNumb = padNumb;
    this.breakPads = breakPads;
    this.broken = broken;

    for (var i = 0; i < padNumb; i++) {
      padX[i] = Math.floor(Math.random() * (gW - padW));
      padY[i] = gH - i * 100;
    }

    for (var j = 0; j < bPadNumb; j++) {
      breakPads[j] = Math.floor(Math.random() * padNumb);
    }
  }

  draw(ctx) {
    for (var i = 0; i < this.padX.length; i++) {
      ctx.beginPath();
      if (this.breakPads.includes(i)) {
        ctx.fillStyle = "#000000";
      } else if (Pads.broken.includes(i)) {
        ctx.fillStyle = "#ff0000";
      } else {
        ctx.fillStyle = "#00ff00";
      }
      ctx.rect(
        this.padX[i] - this.buffer,
        this.padY[i],
        this.padW + 2 * this.buffer,
        10
      );
      ctx.fill();
    }
  }
}
