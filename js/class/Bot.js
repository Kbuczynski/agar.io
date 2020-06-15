import Player from "./Player.js";
import { getPageSizes } from "../functions/getPageSizes.js";
import {
  isNearestEnemy,
  distanceToEnemy,
} from "../functions/isNearestEnemy.js";

class Bot extends Player {
  constructor(nick, color, ctx, id) {
    super(nick, color, ctx);
    this.id = id;
    this.speed = 10;
  }

  findPath(enemys) {
    let nearestEnemy = {};
    const playerX = this.ballX - this.sizeRect / 2,
      playerY = this.ballY + this.sizeBall;

    enemys.forEach((enemy) => {
      const enemyX = enemy.ballX - enemy.sizeRect / 2,
        enemyY = enemy.ballY + enemy.sizeBall * 2;

      if (playerX !== enemyX && playerY !== enemyY) {
        if (nearestEnemy.x !== undefined) {
          if (
            isNearestEnemy(
              enemyX,
              enemyY,
              nearestEnemy.x,
              nearestEnemy.y,
              playerX,
              playerY
            )
          ) {
            nearestEnemy = {
              x: enemyX,
              y: enemyY,
            };
          }
        } else {
          nearestEnemy = {
            x: enemyX,
            y: enemyY,
          };
        }
      }
    });

    const RANGE = 400;

    let movesX = Math.random(),
      movesY = Math.random();

    if (distanceToEnemy(nearestEnemy.x, nearestEnemy.y, playerX, playerY) < RANGE) {
      movesX = nearestEnemy.x - playerX;
      movesY = nearestEnemy.y - playerY;
    }

    if (this.ballX > 0 && this.ballX < getPageSizes().x) {
      if (movesX <= 0) {
        this.ballX -= this.speed;
      } else if (movesX > 0) {
        this.ballX += this.speed;
      }
    } else {
      this.ballX = 10;
    }

    if (this.ballY > 0 && this.ballY < getPageSizes().y) {
      if (movesY <= 0) {
        this.ballY -= this.speed;
      } else if (movesY > 0) {
        this.ballY += this.speed;
      }
    } else {
      this.ballY = 10;
    }
  }
}

export default Bot;
