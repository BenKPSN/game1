import Pads from "/src/pads";
var ctrl, rect, loop, dead, scroll, score, doubleJ, onceDJ;
let ctx = document.querySelector("canvas").getContext("2d");

const gameWidth = 320;
const gameHeight = 700;

let pads = new Pads(gameWidth, gameHeight);

doubleJ = 3;
onceDJ = true;

ctx.canvas.width = gameWidth;
ctx.canvas.height = gameHeight;

if (score === undefined) {
  score = 0;
}

rect = {
  image: document.getElementById("char"),
  height: 40,
  jumping: true,
  width: 50,
  x: gameWidth / 2,
  xVelocity: 0,
  y: gameHeight,
  yVelocity: 0
};

ctrl = {
  left: false,
  right: false,
  keyListener: function(event) {
    var keyState = event.type === "keydown" ? true : false;

    switch (event.keyCode) {
      case 65: //left
        ctrl.left = keyState;
        break;

      case 68: //right
        ctrl.right = keyState;
        break;
      case 87:
        if (doubleJ > 0 && onceDJ === true) {
          rect.yVelocity -= 5;
          rect.jumping = false;
          onceDJ = false;
          doubleJ = --doubleJ;
        }
        break;
      case 82:
        dead = true;
        break;
      default:
        break;
    }
  }
};

document.getElementById("canvas").onclick = function reset() {
  rect = {
    image: document.getElementById("char"),
    height: 40,
    jumping: true,
    width: 50,
    x: gameWidth / 2,
    xVelocity: 0,
    y: gameHeight,
    yVelocity: 0
  };
  if (dead === true) {
    ctx.clearRect(0, 0, gameWidth, gameHeight);
    dead = false;
    pads = new Pads(gameWidth, gameHeight);
    loop();
  }
  doubleJ = 3;
  onceDJ = true;
  score = 0;
  pads.broken = [];
};

loop = function() {
  if (rect.jumping === false) {
    rect.yVelocity -= 15;
    rect.jumping = true;
  }

  if (ctrl.left) {
    rect.xVelocity -= 0.6;
  }

  if (ctrl.right) {
    rect.xVelocity += 0.6;
  }

  rect.yVelocity += 0.2; // gravity
  rect.x += rect.xVelocity;
  rect.y += rect.yVelocity;
  rect.xVelocity *= 0.9; // friction
  rect.yVelocity *= 0.9; // friction

  // if rect is falling below floor line
  if (rect.y > 700 - 16 - rect.height) {
    rect.jumping = false;
    rect.y = 700 - 16 - 32;
    rect.yVelocity = 0;
  }

  // if rect is going off the left of the screen
  if (rect.x < -32) {
    rect.x = 320;
  } else if (rect.x > 320) {
    // if rect goes past right boundaryw

    rect.x = -32;
  }

  // COLLISION

  if (rect.yVelocity > 0) {
    for (var i = 0; i < pads.padNumb; i++) {
      if (
        rect.x < pads.padX[i] + pads.padW &&
        rect.x + rect.width > pads.padX[i] &&
        rect.y + rect.height >= pads.padY[i] &&
        rect.y + rect.height <= pads.padY[i] + 10
      ) {
        if (pads.broken.includes(i) !== true) {
          rect.yVelocity = 0;
          rect.y = pads.padY[i] - rect.height;
          rect.jumping = false;
          score = i;
          onceDJ = true;
        }
        if (pads.breakPads.includes(i) && score === i) {
          pads.broken.push(i);
        } else {
        }
      }
    }
  }
  document.getElementById("test2").innerHTML = pads.breakPads;

  if (rect.yVelocity > 0) {
    rect.yVelocity += 1;
  } else if (rect.yVelocity <= 0) {
  }
  //Collision (END)

  //scroll
  if (scroll === undefined) {
    scroll = 0;
  }

  if (rect.y < 200 - scroll) {
    ctx.translate(0, 5);
    scroll += 5;
  }

  if (rect.y > gameHeight - scroll) {
    dead = true;
  }

  //image flip
  if (rect.xVelocity >= 0) {
    rect.image = document.getElementById("charF");
  } else {
    rect.image = document.getElementById("char");
  }

  document.getElementById("test").innerHTML = rect.xVelocity;

  ctx.fillStyle = "#6080ff"; // hex for grey
  ctx.fillRect(0, -pads.padNumb * 101, 320, pads.padNumb * 101 + 700); // x, y, width, height
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = "#00ff00";
  ctx.rect(0, 684, 320, 50);
  ctx.fill();

  pads.draw(ctx);

  ctx.beginPath();
  ctx.drawImage(rect.image, rect.x, rect.y, rect.width, rect.height);

  // score
  ctx.beginPath();
  ctx.fillStyle = "#ff0000";
  ctx.fillRect(0, gameHeight - 60 - scroll, 60, 40);
  ctx.fillStyle = "#010101";
  ctx.font = "40px Bree Serif";
  ctx.fillText(score, 7, gameHeight - 28 - scroll);

  //Double Jump Count
  ctx.fillStyle = "#ff8000";
  ctx.fillRect(gameWidth - 60, gameHeight - 60 - scroll, 60, 40);
  ctx.fillStyle = "#010101";
  ctx.font = "40px Bree Serif";
  ctx.fillText(doubleJ, gameWidth - 53, gameHeight - 28 - scroll);

  // call update when the browser is ready to draw again
  if (dead !== true) {
    window.requestAnimationFrame(loop);
  } else {
    ctx.fillStyle = "#ff0303";
    ctx.fillRect(0, 0 - scroll, gameWidth, gameHeight);
    ctx.fillStyle = "#000000";
    ctx.font = "30px Bree Serif";
    ctx.fillText("Try Harder", 10, 50 - scroll);
    ctx.font = "20px Bree Serif";
    ctx.fillText("Click to try again", 10, 80 - scroll);
    ctx.translate(0, -scroll);
    scroll = 0;
  }
};

/*
function gameOver() {
  ctx.fillStyle = "#ff0303";
  ctx.fillRect(0, 0, 320, 700);
  document.getElementById("test").innerHTML = "dead";
}
*/

window.addEventListener("keydown", ctrl.keyListener);
window.addEventListener("keyup", ctrl.keyListener);
window.requestAnimationFrame(loop);
