var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

var nick = '';

var pageX = window.innerWidth;
var pageY = window.innerHeight;

var playerSize = 10;
var rectSize = 5;

//mouse position
var x = pageX/2;
var y = pageY/2;

var moveX = 1;
var moveY = 1;

//ball position
var ballX = 800; 
var ballY = 200;

var secunds = 0;

var bonusBallSize = 5;
var numberOfBalls = Math.floor((Math.random() * 5) + 2);

const positionBallsX = [];
const positionBallsY = [];

var ballsObject = bonusBalls();

var timerObject = score();

function draw() {
    //responsive canvas
    canvas.setAttribute("width", pageX - 20);
    canvas.setAttribute("height", pageY - 20);

    //background
    c.fillStyle = "#fff";
    c.fillRect(0, 0, 1000, 600);
    c.strokeRect(0, 0, pageX - 20, pageY - 20);
    c.beginPath();

    //bonus balls
    for (var i = 0; i < numberOfBalls; i++) {
        c.arc(ballsObject.x[i], ballsObject.y[i], bonusBallSize, 0, 10 * Math.PI);
        c.fillStyle = "#" + Math.floor((Math.random() * 9) + 1) + Math.floor((Math.random() * 9) + 1) + Math.floor((Math.random() * 9) + 1);
        c.fill();
        c.beginPath();
    }

    //player
    c.textAlign = "center";
    // c.drawImage(document.querySelector("#avatar1"), ballX - 10, ballY, playerSize, playerSize);
    c.arc(ballX, ballY, playerSize, 0, 10 * Math.PI);
    c.fillStyle = "#f00";
    c.fill();

    c.fillRect(ballX - playerSize/2, ballY + playerSize/2, rectSize, rectSize);
    c.fill();

    c.font = "20px sans-serif";
    c.textAlign = "center";
    c.strokeText(nick, ballX, ballY);
    c.beginPath();

    //move speed
    if (i != x) {
        moveX=(ballX-x)/playerSize;
        moveY=(ballY-y)/playerSize;
        ballX=ballX-moveX;
        ballY=ballY-moveY;
    }

    //score
    c.font = "60px sans-serif";
    c.strokeText("Score: " + secunds, pageX/2 - pageX*0.07, 60);
    c.beginPath();

    c.closePath();

    detectCollision();
}

function play() {
    nick = document.querySelector("input").value;
    document.querySelector("#canvas").style.display = "inline";
    document.querySelector("section").style.display = "none";
    main();
}

function score() {
    return secunds++;
}

function growingPlayer() {
    if (playerSize <= 300) {
        playerSize++
        rectSize++;
    }
}

function detectCollision() {
    for (var i = 0; i < numberOfBalls; i++) {
        if (ballsObject.x[i] < ballX + playerSize/2 && ballsObject.x[i] > ballX - playerSize/2
            && ballsObject.y[i] < ballY + playerSize/2 && ballsObject.y[i] > ballY - playerSize/2) {
                playerSize = 10;
                rectSize = 5;
                positionBallsX.splice(i, 1);
                positionBallsY.splice(i, 1);
            }
    }
}

function bonusBalls() {
    positionBallsX.splice(0, numberOfBalls);
    positionBallsY.splice(0, numberOfBalls);

    for (var i = 0; i < numberOfBalls; i++) positionBallsX.push(Math.floor(Math.random() * pageX + 1));
    for (var i = 0; i < numberOfBalls; i++) positionBallsY.push(Math.floor(Math.random() * pageY + 1));

    return {
        x: positionBallsX,
        y: positionBallsY
    }; 
}

//report the mouse position on move
canvas.addEventListener("mousemove", function (evt) {
    var mousePos = getMousePos(canvas, evt);
    x = mousePos.x;
    y = mousePos.y;
}, false);


//get mouse position
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function main() {
    setInterval('draw()', 10);
    setInterval('growingPlayer(), score()', 1000);
    setInterval('bonusBalls()', 30000);
}