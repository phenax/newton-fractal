import * as R from "ramda";
import * as C from "./complex";
import * as functions from "./functions";
import { createCanvas, forEachPixel } from './canvas'
import "../style.css";

const MAX_ITERATIONS = 100;

const getAlpha = n => (n * 10) / MAX_ITERATIONS;
const getColor = R.cond([
  [R.gt(R.__, 13), n => [70, 130, 255, getAlpha(n)]],
  [R.gt(R.__, 1), n => [70, 255, 130, getAlpha(n)]],
  [R.T, n => [30, 30, 30, getAlpha(n)]],
]);

const init = ({ func, size, scale = 200 }) => {
  const { $canvas, ctx } = createCanvas(size);
  document.body.appendChild($canvas);

  const { fn, dfn, a } = func

  forEachPixel(ctx, size, (x, y) => {
    let z = C.scalarMul(1 / scale, C.make(x, y));

    let nextZ, n;
    for (n = 0; n < MAX_ITERATIONS; n++) {
      // Z' = Z - a*P(Z)/P'(Z)
      const step = C.div(fn(z), dfn(z));
      nextZ = C.minus(z, C.mul(a, step));

      if (C.distance(nextZ, z) < 0.001) break;
      z = nextZ;
    }

    return getColor(n);
  });
};

init({
  func: functions.x3_1_1,
  size: { w: 900, h: 900 },
  scale: 200,
})
