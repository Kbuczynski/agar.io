import { getPageSizes } from "./getPageSizes.js";

const bonusBallSize = 5;
export const numberOfBalls = 20;

export const generateBonusBalls = () => {
  const positionBallsX = [],
    positionBallsY = [];

  const pageX = getPageSizes().x,
    pageY = getPageSizes().y;

  for (let i = 0; i < numberOfBalls; i++)
    positionBallsX.push(Math.floor(Math.random() * pageX + 1));
  for (let i = 0; i < numberOfBalls; i++)
    positionBallsY.push(Math.floor(Math.random() * pageY + 1));

  return {
    x: positionBallsX,
    y: positionBallsY,
  };
};

export const drawBonusBalls = (ctx, ballsObject) => {
  for (let i = 0; i < numberOfBalls; i++) {
    ctx.arc(ballsObject.x[i], ballsObject.y[i], bonusBallSize, 0, 10 * Math.PI);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.beginPath();
  }
};
