import * as R from "ramda";
import * as C from "./complex";
import * as functions from "./functions";
import { createCanvas, forEachPixel } from "./canvas";
import "../style.css";

const MAX_ITERATIONS = 100;

const getAlpha = (n) => (n * 10) / MAX_ITERATIONS;
const getColor = R.cond([
  [R.gt(R.__, 13), (n) => [70, 130, 255, getAlpha(n)]],
  [R.gt(R.__, 1), (n) => [70, 255, 130, getAlpha(n)]],
  [R.T, (n) => [30, 30, 30, getAlpha(n)]],
]);

const draw = ({ ctx, func, size, scale = 200 }) => {
  const { fn, dfn, a = C.make(1, 0), zero = 0.0001 } = func;

  forEachPixel(ctx, size, (x, y) => {
    let z = C.make(x / scale, y / scale);

    let nextZ, n;
    for (n = 0; n < MAX_ITERATIONS; n++) {
      // Z' = Z - a*P(Z)/P'(Z)
      const step = C.div(fn(z), dfn(z));
      nextZ = C.minus(z, C.mul(a, step));

      if (Math.abs(nextZ.re - z.re) < zero) break;
      // if (C.distance(nextZ, z) < zero) break;
      z = nextZ;
    }

    return getColor(n);
  });
};

const init = (max, n, options) => {
  const { ctx, size } = options;
  const m = n / max;

  ctx.clearRect(0, 0, size.w, size.h);

  draw({
    ctx,
    //func: functions.x3_1_1,
    func: { ...functions.x3_1_1, a: C.make(m, 0) },
    size,
    scale: 100,
  });

  if (n < max) {
    requestAnimationFrame(() => init(max, n + 1, options));
  } else {
    console.timeEnd("init");
  }
};

const size = { w: 900, h: 900 };
const { $canvas, ctx } = createCanvas(size);
document.body.appendChild($canvas);

console.time("init");
init(50, 40, { ctx, size });
// 32005.693115234375 ms
