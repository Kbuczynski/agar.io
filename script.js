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
  }

  draw() {
    if (this.isLives) {
      //ball
      c.arc(this.ballX, this.ballY, this.sizeBall, 0, 10 * Math.PI);
      c.fillStyle = this.color;
      c.fill();

      //rect
      c.fillRect(
        this.ballX - this.sizeBall / 2,
        this.ballY + this.sizeBall / 2,
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
    if (this.sizeBall <= 50) {
      this.sizeBall++;
      this.sizeRect++;
    }
  }

  collision(enemy) {
    let enemyX = enemy.ballX - enemy.sizeBall / 2;
    let enemyY = enemy.ballY + enemy.sizeBall / 2;

    //collision with balls
    for (let i = 0; i < numberOfBalls; i++) {
      if (
        ballsObject.x[i] < this.ballX + this.sizeBall / 2 &&
        ballsObject.x[i] > this.ballX - this.sizeBall / 2 &&
        ballsObject.y[i] < this.ballY + this.sizeBall / 2 &&
        ballsObject.y[i] > this.ballY - this.sizeBall / 2
      ) {
        this.sizeBall = 10;
        this.sizeRect = 5;
        positionBallsX.splice(i, 1);
        positionBallsY.splice(i, 1);
      }
    }

    //collision with enemy
    if (
      enemyX < this.ballX + this.sizeBall / 2 &&
      enemyX > this.ballX - this.sizeBall / 2 &&
      enemyY < this.ballY + this.sizeBall / 2 &&
      enemyY > this.ballY - this.sizeBall / 2
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
    }
  }
}

class Bot extends Player {
  constructor(nick, color) {
    super(nick, color);
  }

  findPath(enemy) {
    let speed = 1;

    //enemy coordinates
    let enemyX = enemy.ballX - enemy.sizeBall / 2;
    let enemyY = enemy.ballY + enemy.sizeBall / 2;

    //player coordinates
    let x = this.ballX;
    let y = this.ballY;

    let MovesX = enemyX - x;
    let MovesY = enemyY - y;

    if (MovesX < 0) {
      this.ballX = this.ballX - speed;
    } else if (MovesX > 0) {
      this.ballX = this.ballX + speed;
    }

    if (MovesY < 0) {
      this.ballY = this.ballY - speed;
    } else if (MovesY > 0) {
      this.ballY = this.ballY + speed;
    }
  }
}

//main player object
let MainPlayer = new Player("", "");

//bots objects
const Bot1 = new Bot("Bot1", "red");

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

  //bonus balls
  drawBonusBalls();

  //player
  MainPlayer.draw();
  MainPlayer.move();

  //bots
  Bot1.draw();
  Bot1.findPath(MainPlayer);

  //detect collision
  MainPlayer.collision(Bot1);
  Bot1.collision(MainPlayer);

  score();

  c.closePath();
}

function score() {
  c.font = "60px sans-serif";
  c.strokeText("Your score: " + MainPlayer.score, pageX / 3, 60);
  c.beginPath();

  c.font = "60px sans-serif";
  c.strokeText("Bots score: " + Bot1.score, pageX / 3 + pageX / 3, 60);
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
  setInterval("MainPlayer.growing(), Bot1.growing()", 1000);
  setInterval("generateBonusBalls()", 30000);
}
