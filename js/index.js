import Player from "./class/Player.js";
import Bot from "./class/Bot.js";
import { getPageSizes } from "./functions/getPageSizes.js";
import { handleForm } from "./functions/handleForm.js";
import { viewScore } from "./functions/viewScore.js";
import { getRandomNames } from "./functions/getRandomNames.js";
import {
  numberOfBalls,
  generateBonusBalls,
  drawBonusBalls,
} from "./functions/bonusBalls.js";

const canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d");

const buttonPlay = document.querySelector("#play"),
  preloader = document.querySelector(".preloader");

const pageX = getPageSizes().x,
  pageY = getPageSizes().y;

let formValues = {},
  botsArray = [],
  playersArray = [];

let ballsObject = generateBonusBalls();

let MainPlayer = null;

buttonPlay.addEventListener("click", handleStart);

async function handleStart(e) {
  e.preventDefault();

  formValues = handleForm();
  const { nick, color, enemys } = formValues;

  preloader.style.display = "inline";

  await getRandomNames(enemys).then((names) => {
    names.forEach((name, index) => {
      const randomColor = Math.floor(Math.random() * 16777215).toString(16);
      botsArray.push(
        new Bot(name.replace(/_/g, " "), `#${randomColor}`, ctx, index)
      );
    });
  });

  preloader.style.display = "none";

  if (formValues.mode === 0) {
    MainPlayer = new Player(nick, color, ctx);
    playersArray = botsArray.concat(MainPlayer);

    canvas.addEventListener("mousemove", (e) => {
      MainPlayer.reportMousePosition(e, canvas);
    });
  } else {
    playersArray = botsArray;
  }

  main();
}

function start() {
  canvas.setAttribute("width", pageX);
  canvas.setAttribute("height", pageY - 4);

  viewScore(playersArray);
  drawBonusBalls(ctx, ballsObject);

  botsArray.forEach((bot) => {
    bot.regeneration();
    bot.draw();
    bot.findPath(playersArray);
    bot.move();
    bot.collision(playersArray, numberOfBalls, ballsObject);
  });

  if (MainPlayer != null) {
    MainPlayer.regeneration();
    MainPlayer.draw();
    MainPlayer.move();
    MainPlayer.collision(botsArray, numberOfBalls, ballsObject);
  }

  ctx.closePath();
}

function main() {
  const TIME_TO_REFRESH_CANVAS = 30,
    TIME_TO_NEW_BALLS = 10000,
    TIME_TO_GROWING = 1000;

  buttonPlay.removeEventListener("click", handleStart, true);

  setInterval(start, TIME_TO_REFRESH_CANVAS);

  setInterval(() => (ballsObject = generateBonusBalls()), TIME_TO_NEW_BALLS);

  setInterval(() => {
    if (MainPlayer != null) MainPlayer.growing();
    botsArray.forEach((bot) => {
      bot.growing();
    });
  }, TIME_TO_GROWING);
}
