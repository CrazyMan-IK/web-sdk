import { vec2 } from './vec2';

const game = document.getElementById('game') as HTMLElement;

const baseSize = {
  x: 720,
  y: 1280
};
//const baseSizeMatch = baseSize.x / baseSize.y;
const baseSizeMatch = 0.631;

function lerp(a: number, b: number, t: number) {
  return a * (1 - t) + b * t;
}

function log2(n: vec2) {
  return {
    x: Math.log2(n.x),
    y: Math.log2(n.y)
  };
}

function divide(a: vec2, b: vec2) {
  return {
    x: a.x / b.x,
    y: a.y / b.y
  };
}

function getScaleFactor(baseSize: vec2, viewportSize: vec2, match: number) {
  const scaleFactor = log2(divide(baseSize, viewportSize));
  const averageScaleFactor = lerp(scaleFactor.x, scaleFactor.y, match);

  return Math.pow(2, averageScaleFactor);
}

let cachedSF = 0;

export function getCurrentScaleFactor() {
  if (cachedSF <= 0) {
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;

    //const match = maxWidth / maxHeight >= 0.63 ? 1 : 0;
    const match = maxWidth / maxHeight >= baseSizeMatch ? 1 : 0;

    cachedSF = getScaleFactor(baseSize, { x: maxWidth, y: maxHeight }, match);
  }

  return cachedSF;
}

function resizeGame() {
  //const aspectRatio = 720 / 1280; // Set your desired aspect ratio (e.g., 16:9)
  const maxWidth = window.innerWidth;
  const maxHeight = window.innerHeight;

  cachedSF = 0;

  const sf = getCurrentScaleFactor();
  const sf2 = 1 / sf;

  // let newWidth = maxWidth;
  // let newHeight = maxWidth / aspectRatio;
  const newWidth = maxWidth / sf2;
  const newHeight = maxHeight / sf2;
  //const newWidth2 = newWidth * (1 - sf);
  //const newHeight2 = newHeight * (1 - sf);

  // if (newHeight > maxHeight) {
  //   newHeight = maxHeight;
  //   newWidth = maxHeight * aspectRatio;
  // }

  // game.width = newWidth;
  // game.height = newHeight;

  //game.style.width = `${newWidth}px`;
  //game.style.height = `${newHeight}px`;
  game.style.scale = sf2.toString();
  game.style.width = `${newWidth}px`;
  game.style.height = `${newHeight}px`;
  //game.style.maxWidth = `${baseSize.x}px`;
  //game.style.maxHeight = `${baseSize.y}px`;

  //game.style.left = `${(window.innerWidth - newWidth) / 2}px`;
  //game.style.top = `${(window.innerHeight - newHeight) / 2}px`;
  //720 = 0
  //540 = 90
  //360 = 180
  //180 = 270
  //90 = 315
  game.style.left = `${(newWidth - maxWidth) / -2}px`;
  game.style.top = `${(newHeight - maxHeight) / -2}px`;
}

window.addEventListener('resize', resizeGame);
resizeGame();
