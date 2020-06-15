import { getPageSizes } from "../functions/getPageSizes.js";
import { getMousePosition } from "../functions/getMousePosition.js";

class Player {
  constructor(nick, color, ctx) {
    this.nick = nick;
    this.color = color;
    this.ctx = ctx;
    this.score = 0;
    this.isLives = true;
    this.sizeBall = 10;
    this.sizeRect = 5;
    this.ballX = Math.floor(Math.random() * getPageSizes().x);
    this.ballY = Math.floor(Math.random() * getPageSizes().y);
    this.x = getPageSizes().x / 2;
    this.y = getPageSizes().y / 2;
    this.moveX = 1;
    this.moveY = 1;
  }

  draw() {
    if (this.isLives) {
      const { ctx } = this;

      ctx.arc(this.ballX, this.ballY, this.sizeBall, 0, 10 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.fill();

      ctx.fillRect(
        this.ballX - this.sizeRect / 2,
        this.ballY + this.sizeBall,
        this.sizeRect,
        this.sizeRect
      );
      ctx.fill();
      ctx.beginPath();

      ctx.font = "20px sans-serif";
      ctx.textAlign = "center";
      ctx.strokeStyle = this.color;
      ctx.strokeText(this.nick, this.ballX, this.ballY - this.sizeBall - 10);
      ctx.beginPath();
    }
  }

  reportMousePosition(e, canvas) {
    const mousePosition = getMousePosition(canvas, e);

    this.x = mousePosition.x;
    this.y = mousePosition.y;
  }

  move() {
    this.moveX = (this.ballX - this.x) / this.sizeBall;
    this.moveY = (this.ballY - this.y) / this.sizeBall;
    this.ballX = this.ballX - this.moveX;
    this.ballY = this.ballY - this.moveY;
  }

  growing() {
    if (this.sizeBall < 100) {
      this.sizeBall += 3;
      this.sizeRect += 3;
    }
  }

  collision(enemys, numberOfBalls, ballsObject) {
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
        ballsObject.x.splice(i, 1);
        ballsObject.y.splice(i, 1);
      }
    }

    //collision with enemys
    enemys.forEach(enemy => {
      let enemyX = enemy.ballX - enemy.sizeRect / 2;
      let enemyY = enemy.ballY + enemy.sizeBall;
  
      if (
        Math.sqrt(
          Math.pow(enemyX - this.ballX, 2) + Math.pow(enemyY - this.ballY, 2)
        ) < this.sizeBall
      ) {
        enemy.isLives = false;
        this.score += 1;
      }
    })
  }

  regeneration() {
    if (this.isLives === false) {
      this.score = 0;
      this.isLives = true;
      this.sizeBall = 10;
      this.sizeRect = 5;
      this.ballX = Math.floor(Math.random() * getPageSizes().x);
      this.ballY = Math.floor(Math.random() * getPageSizes().y);
    }
  }
}

export default Player;