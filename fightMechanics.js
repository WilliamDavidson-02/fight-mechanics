const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const myFont = new FontFace("myFont", "url(font/mk1.ttf)");
const timerInterval = setInterval(timerCountDown, 1000);

myFont.load().then(function(font) {
  document.fonts.add(font);
});
// Forest background
const backgroundImgLayer1 = new Image();
backgroundImgLayer1.src = "img/background/background_layer_1.png";
const backgroundImgLayer2 = new Image();
backgroundImgLayer2.src = "img/background/background_layer_2.png";
const backgroundImgLayer3 = new Image();
backgroundImgLayer3.src = "img/background/background_layer_3.png";
const groundImg = new Image();
groundImg.src = "img/oak_woods_tileset.png";
const forestWidth = window.innerWidth;
const forestHeight = window.innerHeight;
// House img
const houseImg = new Image();
houseImg.src = "img/decorations/shop_anim.png";
let houseWidth, houseHeight, houseFrame = 0;
houseImg.onload = () => {
  houseWidth = houseImg.width / 6;
  houseHeight = houseImg.height;
};
setInterval(() => {
  houseFrame = (houseFrame + houseWidth) % (houseImg.width - houseWidth);
}, 70);
// Foreground Decoratinos
const fenceImg = new Image();
fenceImg.src = "img/decorations/fence_1.png";

// First Player Image
const firstPlayerImg = new Image();
firstPlayerImg.src = "img/player1/Idle.png";
let firstPlayerImgWidth, firstPlayerImgHeight, firstPlayerImgFrame = 0;
firstPlayerImg.onload = () => {
  firstPlayerImgWidth = firstPlayerImg.width / 4;
  firstPlayerImgHeight = firstPlayerImg.height;
};

let players = {
  playerHeight: 150,
  playerWidth: 50,
  fistHeight: 50,
  dx: 12,
  dy: 25,
  playersTouching: false,
  playerOnTop: false,
  timer: 99,
}

let firstPlayer = {
  y: 0,
  playerPost: 200,
  fistWidth: 0,
  playerHealt: -500,
  rightPressed: false,
  leftPressed: false,
  jumping: false,
  firstPlayerAttack: false,
  firstPlayerDirection: true,
}

let secondPlayer = {
  y2: 0,
  player2Post: window.innerWidth - 250,
  fist2Width: 0,
  player2Healt: 500,
  right2Pressed: false,
  left2Pressed: false,
  jumping2: false,
  secondPlayerAttack: false,
  secondPlayerDirection: false,
}


function timerCountDown() {
  if (players.timer > 0) {
    players.timer--;
  } else {
    location.reload();
  }
}

function getCanvasSize() {
    ctx.canvas.height = window.innerHeight;
    ctx.canvas.width = window.innerWidth;
    firstPlayer.y = window.innerHeight - players.playerHeight
    secondPlayer.y2 = firstPlayer.y
}

function drawBackground() {
  ctx.drawImage(backgroundImgLayer1, 0, 0, window.innerWidth, window.innerHeight);
  ctx.drawImage(backgroundImgLayer2, 0, 0, window.innerWidth, window.innerHeight);
  ctx.drawImage(backgroundImgLayer3, 0, 0, window.innerWidth, window.innerHeight);
  ctx.drawImage(houseImg, houseFrame, 0, houseWidth, houseHeight, canvas.width - 650, canvas.height - 740, 650, 700);
  for (let i = 0; i < canvas.width; i += 190) {
    ctx.drawImage(groundImg, 288, 190, 50, 30, i, canvas.height - 50, 250, 150);
  }
}

function drawForegroundImg() {
  ctx.drawImage(fenceImg, 0, 0, fenceImg.width, fenceImg.height, 50, canvas.height - fenceImg.height * 4 - 40, fenceImg.width * 4, fenceImg.height * 4)
}

function drawFirstPlayer() {
  ctx.beginPath();
  ctx.fillStyle = "#D4B483";
  ctx.fillRect(firstPlayer.playerPost, firstPlayer.y - 40, firstPlayer.fistWidth, players.fistHeight);
  ctx.closePath();

  ctx.fillStyle = "#4281A4";
  ctx.fillRect(firstPlayer.playerPost, firstPlayer.y - 40, players.playerWidth, players.playerHeight);

}

function drawSecondPlayer() {
  ctx.beginPath();
  ctx.fillStyle = "#D4B483";
  ctx.fillRect(secondPlayer.player2Post, secondPlayer.y2 - 40, secondPlayer.fist2Width, players.fistHeight);
  ctx.closePath();

  ctx.fillStyle = "#C1666B";
  ctx.fillRect(secondPlayer.player2Post, secondPlayer.y2 - 40, players.playerWidth, players.playerHeight);
}

function drawHealthDisplay() {
  ctx.beginPath();
  
  ctx.fillStyle = "#4281A4";
  ctx.fillRect((canvas.width / 2) - 60, 50, firstPlayer.playerHealt, 120);
  
  ctx.fillStyle = "#C1666B";
  ctx.fillRect((canvas.width / 2) + 60, 50, secondPlayer.player2Healt, 120);
  
  ctx.fillStyle = "#D4B483";
  ctx.fillRect((canvas.width - 120) / 2, 50, 120, 120);
  
  ctx.strokeStyle = "#E4DFDA";
  ctx.lineWidth = 10;
  ctx.strokeRect((canvas.width - 120) / 2, 50, 120, 120);

  ctx.font = "80px myFont";
  ctx.textAlign = "center";
  ctx.fillStyle = "#fff"
  ctx.fillText(players.timer, canvas.width / 2, 138);
  ctx.closePath();
}

function endGameChecker() {
  if(firstPlayer.playerHealt >= 0 || secondPlayer.player2Healt <= 0) {
    location.reload();
  }
}

function drawDisplay() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawFirstPlayer();
    drawSecondPlayer();
    drawForegroundImg();
    drawHealthDisplay();
    firstPlayerMovement();
    secondPlayerMovement();
    jumpingAnimation();
    playerConnect();
    endGameChecker();
    requestAnimationFrame(drawDisplay);
}

function playerConnect() {
  players.playersTouching = firstPlayer.playerPost + players.playerWidth <= secondPlayer.player2Post || firstPlayer.playerPost >= secondPlayer.player2Post + players.playerWidth || firstPlayer.y + players.playerHeight < secondPlayer.y2 || firstPlayer.y > secondPlayer.y2 + players.playerHeight ? false : true;
  players.playerOnTop = firstPlayer.y + players.playerHeight <= secondPlayer.y2 || firstPlayer.y >= secondPlayer.y2 + players.playerHeight ? true : false;
}

function firstPlayerMovement() {
    if (firstPlayer.rightPressed && firstPlayer.playerPost < canvas.width - players.playerWidth) {
        if (!players.playersTouching && !firstPlayer.jumping) {
          firstPlayer.playerPost += players.dx;
          firstPlayer.firstPlayerDirection = true;
        } else if (firstPlayer.rightPressed && players.playersTouching && firstPlayer.playerPost >= secondPlayer.player2Post || players.playerOnTop) {
          firstPlayer.playerPost += players.dx;
          firstPlayer.firstPlayerDirection = true;
        }
    } else if (firstPlayer.leftPressed && firstPlayer.playerPost > 0) {
        if (!players.playersTouching && !firstPlayer.jumping) {
          firstPlayer.playerPost -= players.dx;
          firstPlayer.firstPlayerDirection = false;
        } else if(firstPlayer.leftPressed && players.playersTouching && firstPlayer.playerPost <= secondPlayer.player2Post || players.playerOnTop) {
          firstPlayer.playerPost -= players.dx;
          firstPlayer.firstPlayerDirection = false;
        }
    }
}

function secondPlayerMovement() {
    if (secondPlayer.right2Pressed && secondPlayer.player2Post < canvas.width - players.playerWidth) {
        if (!players.playersTouching && !secondPlayer.jumping2) {
          secondPlayer.player2Post += players.dx;
          secondPlayer.secondPlayerDirection = true;
        } else if (secondPlayer.right2Pressed && players.playersTouching && secondPlayer.player2Post >= firstPlayer.playerPost || players.playerOnTop) {
          secondPlayer.player2Post += players.dx;
          secondPlayer.secondPlayerDirection = true;
        }
    } else if (secondPlayer.left2Pressed && secondPlayer.player2Post > 0) {
        if (!players.playersTouching && !secondPlayer.jumping2) {
          secondPlayer.player2Post -= players.dx;
          secondPlayer.secondPlayerDirection = false;
        } else if (secondPlayer.left2Pressed && players.playersTouching && firstPlayer.playerPost >= secondPlayer.player2Post || players.playerOnTop) {
          secondPlayer.player2Post -= players.dx;
          secondPlayer.secondPlayerDirection = false;
        }
    }
}

function attackAnimation() {
  if (firstPlayer.firstPlayerAttack) {
      firstPlayer.fistWidth = firstPlayer.firstPlayerDirection ? 125 : -75;
      seondPlayerDamage();
      setTimeout(() => {
        firstPlayer.fistWidth = 0;
        firstPlayer.firstPlayerAttack = false;
      }, 80)
  }
  if (secondPlayer.secondPlayerAttack) {
      secondPlayer.fist2Width = secondPlayer.secondPlayerDirection ? 125 : -75;
      firstPlayerDamage();
      setTimeout(() => {
          secondPlayer.fist2Width = 0;
          secondPlayer.secondPlayerAttack = false;
      }, 80)
  }
}

function firstPlayerDamage() {
  if (secondPlayer.player2Post + secondPlayer.fist2Width < firstPlayer.playerPost + players.playerWidth && firstPlayer.playerPost < secondPlayer.player2Post && !secondPlayer.secondPlayerDirection && firstPlayer.y === secondPlayer.y2) {
    firstPlayer.playerHealt += 15; 
  } else if(secondPlayer.player2Post + secondPlayer.fist2Width > firstPlayer.playerPost && secondPlayer.player2Post < firstPlayer.playerPost && secondPlayer.secondPlayerDirection && firstPlayer.y === secondPlayer.y2) {
    firstPlayer.playerHealt += 15;
  }
}

function seondPlayerDamage() {
  if (firstPlayer.playerPost + firstPlayer.fistWidth > secondPlayer.player2Post && firstPlayer.playerPost < secondPlayer.player2Post && firstPlayer.firstPlayerDirection && firstPlayer.y === secondPlayer.y2) {
    secondPlayer.player2Healt -= 15; 
  } else if (firstPlayer.playerPost + firstPlayer.fistWidth < secondPlayer.player2Post + players.playerWidth && firstPlayer.playerPost > secondPlayer.player2Post && !firstPlayer.firstPlayerDirection && firstPlayer.y === secondPlayer.y2) {
    secondPlayer.player2Healt -= 15; 
  }
}

function jumpingAnimation() {
  if (firstPlayer.jumping && firstPlayer.y > (canvas.height / 3) * 2) {
    firstPlayer.y -= players.dy;
  } else if (!firstPlayer.jumping && firstPlayer.y + players.playerHeight < canvas.height && !players.playersTouching) {
    firstPlayer.y += players.dy;
  } else {
    firstPlayer.jumping = false;
  }

  if (secondPlayer.jumping2 && secondPlayer.y2 > (canvas.height / 3) * 2) {
    secondPlayer.y2 -= players.dy;
  } else if (!secondPlayer.jumping2 && secondPlayer.y2 + players.playerHeight < canvas.height && !players.playersTouching) {
    secondPlayer.y2 += players.dy;
  } else {
    secondPlayer.jumping2 = false;
  }

  if (!firstPlayer.jumping && players.playersTouching && firstPlayer.y + players.playerHeight < canvas.height && secondPlayer.y2 + players.playerHeight < canvas.height) {
    firstPlayer.y += players.dy;
    secondPlayer.y2 += players.dy;
  }
}

function keyDownHandler(e) {
  if (e.key === "d") {
    firstPlayer.rightPressed = true;
  } else if (e.key === "a") {
    firstPlayer.leftPressed = true;
  } else if (e.key === "ArrowRight") {
    secondPlayer.right2Pressed = true;
  } else if (e.key === "ArrowLeft") {
    secondPlayer.left2Pressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "d") {
    firstPlayer.rightPressed = false;
  } else if (e.key === "a") {
    firstPlayer.leftPressed = false;
  } else if (e.key === "ArrowRight") {
    secondPlayer.right2Pressed = false;
  } else if (e.key === "ArrowLeft") {
    secondPlayer.left2Pressed = false;
  }
}

function keyPressHandler(event) {
  if (event.key === "w" && firstPlayer.y === canvas.height - players.playerHeight) {
    firstPlayer.jumping = true;
  } else if (event.key === "ArrowUp" && secondPlayer.y2 === canvas.height - players.playerHeight) {
    secondPlayer.jumping2 = true;
  }
  if (event.key === "s") {
    firstPlayer.firstPlayerAttack = true;
    attackAnimation();
  } else if (event.key === "ArrowDown") {
    secondPlayer.secondPlayerAttack = true;
    attackAnimation();
  }
}

// On load
getCanvasSize()
drawDisplay();

// Event Listeners
window.addEventListener("resize", getCanvasSize);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("keydown", keyPressHandler);