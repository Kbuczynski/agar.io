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
var bonusBallSize = 5;
var numberOfBalls = Math.floor(Math.random() * 5 + 2);

const positionBallsX = [];
const positionBallsY = [];

var ballsObject = generateBonusBalls();

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
    //collision with balls
    for (let i = 0; i < numberOfBalls; i++) {
      if (
        ballsObject.x[i] <= this.ballX + this.sizeBall / 2 &&
        ballsObject.x[i] >= this.ballX - this.sizeBall / 2 &&
        ballsObject.y[i] <= this.ballY + this.sizeBall / 2 &&
        ballsObject.y[i] >= this.ballY - this.sizeBall / 2
      ) {
        this.sizeBall = 10;
        this.sizeRect = 5;
        positionBallsX.splice(i, 1);
        positionBallsY.splice(i, 1);
      }
    }

    //collision with enemy
    if (
      enemy.ballX - enemy.sizeBall / 2 + enemy.sizeRect <=
      this.ballX + this.sizeBall / 2
    ) {
      console.log("test");
    }
  }
}

//main player object
let MainPlayer = new Player("", "");

//bots objects
const Bot1 = new Player("Bot", "red");

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

  //bonus balls
  drawBonusBalls();

  //player
  MainPlayer.draw();
  MainPlayer.move();

  Bot1.draw();

  //detect collision
  MainPlayer.collision(Bot1);

  c.closePath();
}

function generateBonusBalls() {
  positionBallsX.splice(0, numberOfBalls);
  positionBallsY.splice(0, numberOfBalls);

  for (var i = 0; i < numberOfBalls; i++)
    positionBallsX.push(Math.floor(Math.random() * pageX + 1));
  for (var i = 0; i < numberOfBalls; i++)
    positionBallsY.push(Math.floor(Math.random() * pageY + 1));

  return {
    x: positionBallsX,
    y: positionBallsY
  };
}

function drawBonusBalls() {
  for (var i = 0; i < numberOfBalls; i++) {
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
    var mousePos = getMousePos(canvas, evt);
    x = mousePos.x;
    y = mousePos.y;
  },
  false
);

//get mouse position
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
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
