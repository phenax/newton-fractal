import { plainText as fragmentShaderSource } from "./newton.frag";
import GlslCanvas from "glslCanvas";
import "../style.css";

const h = (tag, props = {}, children = []) => {
  const $el = Object.assign(document.createElement(tag), props);
  children.forEach(($c) => $el.appendChild($c));
  return $el;
};
const text = (s) => document.createTextNode(s);

const functionsOptions = [
  { name: "z^3 - 2z + 2", id: 4 },
  { name: "z^5 + 2z^3 - 1", id: 0 },
  { name: "sin(z)", id: 1 },
  { name: "cos(z)", id: 2 },
  { name: "z^3 - 1", id: 3 },
];

const $canvas = h("canvas", { style: "border: 1px solid pink" });
const $root = h('div', { className: 'root' }, [
  $canvas,
  h('div', { className: 'options' }, [
    h('div', {}, [ text('Select equation:') ]),
    h( "select", { onchange: (e) => setFunction(e.target.value) },
      functionsOptions.map(({ name, id }) => h("option", { value: id }, [text(name)]))
    ),
  ]),
]);
document.body.appendChild($root);

const setDimensions = () => {
  const coverSize = Math.min(window.innerWidth, window.innerHeight);
  Object.assign($canvas, { width: coverSize, height: coverSize });
};

setDimensions();
window.onresize = setDimensions;

const sandbox = new GlslCanvas($canvas);
sandbox.load(fragmentShaderSource);

const setA = (re, im) => sandbox.setUniform("a", re, im);
const setFunction = (n) => sandbox.setUniform("function_type", parseInt(n, 10));

// Set default value
setFunction(functionsOptions[0].id)

const drawLoop = (forwards = true, n = -50) => {
  const x = Math.max(-0.1, Math.min(3, n / 500));

  n = forwards ? n + 1 : n - 1;

  if (n === 1500) {
    forwards = false;
  } else if (n === -50) {
    forwards = true;
  }

  setA(x, 0.0);

  window.requestAnimationFrame(drawLoop.bind(null, forwards, n));
};

drawLoop();
