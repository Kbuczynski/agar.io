const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

let pageX = window.innerWidth;
let pageY = window.innerHeight;

//mouse position
let x = pageX / 2;
let y = pageY / 2;

let moveX = 1;
let moveY = 1;

//bonus balls
let bonusBallSize = 5;
let numberOfBalls = Math.floor(Math.random() * 10 + 1);

const positionBallsX = [];
const positionBallsY = [];

const ballsObject = generateBonusBalls();

class Player {
  constructor(nick, color) {
    this.nick = nick;
    this.color = color;
    this.score = 0;
    this.isLives = true;
    this.sizeBall = 10;
    this.sizeRect = 5;
    this.ballX = Math.floor(Math.random() * pageX);
    this.ballY = Math.floor(Math.random() * pageY);
    this.speed = 2;
  }

  draw() {
    if (this.isLives) {
      //ball
      c.arc(this.ballX, this.ballY, this.sizeBall, 0, 10 * Math.PI);
      c.fillStyle = this.color;
      c.fill();

      //rect
      c.fillRect(
        this.ballX - this.sizeRect / 2,
        this.ballY + this.sizeBall,
        this.sizeRect,
        this.sizeRect
      );
      c.fill();
      c.beginPath();

      //nick name
      c.font = "20px sans-serif";
      c.textAlign = "center";
      c.strokeStyle = "#000";
      c.strokeText(this.nick, this.ballX, this.ballY);
      c.beginPath();
    }
  }

  move() {
    moveX = (this.ballX - x) / this.sizeBall;
    moveY = (this.ballY - y) / this.sizeBall;
    this.ballX = this.ballX - moveX;
    this.ballY = this.ballY - moveY;
  }

  growing() {
    if (this.sizeBall < 50) {
      this.sizeBall += 3;
      this.sizeRect += 3;

      if (this.speed > 0) this.speed = this.speed * 0.9;
      else this.speed = 0.5;
    }
  }

  collision(enemy) {
    let enemyX = enemy.ballX - enemy.sizeRect / 2;
    let enemyY = enemy.ballY + enemy.sizeBall;

    //collision with balls
    for (let i = 0; i < numberOfBalls; i++) {
      if (
        Math.sqrt(
          Math.pow(ballsObject.x[i] - this.ballX, 2) +
            Math.pow(ballsObject.y[i] - this.ballY, 2)
        ) < this.sizeBall
      ) {
        this.sizeBall = 10;
        this.sizeRect = 5;
        positionBallsX.splice(i, 1);
        positionBallsY.splice(i, 1);
      }
    }

    //collision with enemy
    if (
      Math.sqrt(
        Math.pow(enemyX - this.ballX, 2) + Math.pow(enemyY - this.ballY, 2)
      ) < this.sizeBall
    ) {
      enemy.isLives = false;
      this.score += 1;
    }
  }

  regeneration() {
    if (this.isLives == false) {
      this.score = 0;
      this.isLives = true;
      this.sizeBall = 10;
      this.sizeRect = 5;
      this.ballX = Math.floor(Math.random() * pageX);
      this.ballY = Math.floor(Math.random() * pageY);

      this.speed = 2;
    }
  }
}

class Bot extends Player {
  constructor(nick, color) {
    super(nick, color);
  }

  findPath(enemy) {
    //enemy coordinates
    let enemyX = enemy.ballX - enemy.sizeRect / 2;
    let enemyY = enemy.ballY + enemy.sizeBall;

    //player coordinates
    let x = this.ballX;
    let y = this.ballY;

    let MovesX = enemyX - x;
    let MovesY = enemyY - y;

    if (this.ballX > 0 && this.ballX < pageX) {
      if (MovesX < 0) {
        this.ballX = this.ballX - this.speed;
      } else if (MovesX > 0) {
        this.ballX = this.ballX + this.speed;
      }
    } else {
      this.ballX = 10;
    }

    if (this.ballY > 0 && this.ballY < pageY) {
      if (MovesY < 0) {
        this.ballY = this.ballY - this.speed;
      } else if (MovesY > 0) {
        this.ballY = this.ballY + this.speed;
      }
    } else {
      this.ballY = 10;
    }
  }
}

//main player object
let MainPlayer = new Player("", "");

//bots objects
const Bot1 = new Bot("BotRed", "red");
const Bot2 = new Bot("Bot2Yellow", "yellow");

function play() {
  MainPlayer = new Player(
    document.getElementById("nick").value,
    document.getElementById("color").value
  );

  document.querySelector("section").style.display = "none";

  main();
}

function draw() {
  //responsive canvas
  canvas.setAttribute("width", pageX - 20);
  canvas.setAttribute("height", pageY - 20);

  //regenerations
  MainPlayer.regeneration();

  Bot1.regeneration();
  Bot2.regeneration();

  //bonus balls
  drawBonusBalls();

  //bots
  MainPlayer.draw();
  MainPlayer.move();

  Bot1.draw();
  Bot1.findPath(MainPlayer);
  //Bot1.findPath(Bot2);

  Bot2.draw();
  //Bot2.findPath(MainPlayer);
  Bot2.findPath(Bot1);

  //player
  MainPlayer.draw();
  MainPlayer.move();

  //detect collision
  MainPlayer.collision(Bot1);
  MainPlayer.collision(Bot2);

  Bot1.collision(MainPlayer);
  Bot1.collision(Bot2);

  Bot2.collision(MainPlayer);
  Bot2.collision(Bot1);

  score();

  c.closePath();
}

function score() {
  let y = 40;
  let x = 0;

  c.textAlign = "left";

  c.font = "30px sans-serif";
  c.strokeText(MainPlayer.nick + " score: " + MainPlayer.score, x, y);
  c.beginPath();

  c.font = "30px sans-serif";
  c.strokeText(Bot1.nick + " score: " + Bot1.score, x, y + y);
  c.beginPath();

  c.font = "30px sans-serif";
  c.strokeText(Bot2.nick + " score: " + Bot2.score, x, y + y * 2);
  c.beginPath();
}

function generateBonusBalls() {
  positionBallsX.splice(0, numberOfBalls);
  positionBallsY.splice(0, numberOfBalls);

  for (let i = 0; i < numberOfBalls; i++)
    positionBallsX.push(Math.floor(Math.random() * pageX + 1));
  for (let i = 0; i < numberOfBalls; i++)
    positionBallsY.push(Math.floor(Math.random() * pageY + 1));

  return {
    x: positionBallsX,
    y: positionBallsY
  };
}

function drawBonusBalls() {
  for (let i = 0; i < numberOfBalls; i++) {
    c.arc(ballsObject.x[i], ballsObject.y[i], bonusBallSize, 0, 10 * Math.PI);
    c.fillStyle =
      "#" +
      Math.floor(Math.random() * 9 + 1) +
      Math.floor(Math.random() * 9 + 1) +
      Math.floor(Math.random() * 9 + 1);
    c.fill();
    c.beginPath();
  }
}

//report the mouse position on move
canvas.addEventListener(
  "mousemove",
  function(evt) {
    let mousePos = getMousePos(canvas, evt);
    x = mousePos.x;
    y = mousePos.y;
  },
  false
);

//get mouse position
function getMousePos(canvas, evt) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function main() {
  setInterval("draw()", 10);
  setInterval("Bot2.growing(), Bot1.growing(), MainPlayer.growing()", 3000);
  setInterval("generateBonusBalls()", 20000);
}
