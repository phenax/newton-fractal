import { plainText as fragmentShaderSource } from "./newton.frag";
import GlslCanvas from "glslCanvas";
import "../style.css";

const $canvas = document.createElement("canvas");
document.body.appendChild($canvas);
$canvas.style.border = "1px solid pink";
const setDimensions = () => {
  const coverSize = Math.min(window.innerWidth, window.innerHeight);
  $canvas.width = coverSize;
  $canvas.height = coverSize;
};

setDimensions();
window.onresize = setDimensions;

const sandbox = new GlslCanvas($canvas);
sandbox.load(fragmentShaderSource);

const setA = (re, im) => sandbox.setUniform("a", re, im);

setA(1.0, 0.0);

let forwards = true;

const drawLoop = (n = -50) => {
  const x = Math.max(-0.1, Math.min(3, n / 500));

  n = forwards ? n + 1 : n - 1;

  if (n === 1500) {
    forwards = false;
  } else if (n === -50) {
    forwards = true;
  }

  setA(x, 0.0);

  window.requestAnimationFrame(drawLoop.bind(null, n));
};

drawLoop();
