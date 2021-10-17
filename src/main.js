import { plainText as fragmentShaderSource } from "./newton.frag";
import GlslCanvas from 'glslCanvas';
import '../style.css'

const $canvas = document.createElement("canvas");
document.body.appendChild($canvas);
$canvas.style.border = "1px solid pink";
const setDimensions = () => {
  const coverSize = Math.min(window.innerWidth, window.innerHeight)
  $canvas.width = coverSize;
  $canvas.height = coverSize;
}

setDimensions();
window.onresize = setDimensions;

const sandbox = new GlslCanvas($canvas)
sandbox.load(fragmentShaderSource)

const setA = (re, im) => {
  sandbox.setUniform("a", re, im)
};

setA(1.0, 0.0);

const drawLoop = n => {
  const x = Math.min(3, n / 500)
  setA(x, 0.0)

  window.requestAnimationFrame(drawLoop.bind(null, n + 1))
};

drawLoop(-10)

