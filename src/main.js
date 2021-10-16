import {clamp, gt, T} from "ramda";
import * as R from 'ramda'
import "../style.css";

const DIMENSIONS = { w: 900, h: 900 };
const MAX_ITERATIONS = 100;
const SCALE = 300;

const Complex = (re, im) => ({ re, im });
Complex.add = (a, b) => Complex(a.re + b.re, a.im + b.im);
Complex.minus = (a, b) => Complex(a.re - b.re, a.im - b.im);
Complex.scalarMul = (n, c) => Complex(c.re * n, c.im * n);
Complex.mul = (a, b) =>
  Complex(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
Complex.div = (a, b) => {
  const mul = 1 / (b.re ** 2 + b.im ** 2);
  const c = Complex.mul(a, Complex(b.re, -b.im));
  return Complex.scalarMul(mul, c);
};
Complex.magnitude = (c) => Math.sqrt(c.re ** 2 + c.im ** 2);
Complex.distance = (a, b) => Complex.magnitude(Complex.minus(a, b));
Complex.pow = (c, n) => (n <= 1 ? c : Complex.mul(c, Complex.pow(c, n - 1)));

const newtonsMethod = (z, { fn, dfn }) => {
  // Z' = Z - a*P(Z)/P'(Z)
  const a = Complex(1, 0)
  const step = Complex.div(fn(z), dfn(z));
  return Complex.minus(z, Complex.mul(a, step));
};

const getRootColor = (c, options) => {
  let z = c;
  let nextZ = newtonsMethod(z, options);

  let n;
  for (n = 0; n < MAX_ITERATIONS; n++) {
    nextZ = newtonsMethod(nextZ, options);

    if (Complex.distance(nextZ, z) < 0.001) break;

    z = nextZ;
  }

  const alpha = n*10/MAX_ITERATIONS

  const getColor = R.cond([
    [gt(R.__, 13), () => [70, 130, 255, alpha]],
    [gt(R.__, 1), () => [70, 255, 130, alpha]],
    [T, () => [30, 30, 30, alpha]],
  ])

  return getColor(n)
};

const init = () => {
  const $canvas = document.createElement("canvas");
  document.body.appendChild($canvas);
  $canvas.width = DIMENSIONS.w;
  $canvas.height = DIMENSIONS.h;
  $canvas.style.border = "1px solid pink";

  const ctx = $canvas.getContext("2d");

  const fn = (c) => Complex.minus(Complex.pow(c, 3), Complex(1, 0));
  const dfn = (c) => Complex.scalarMul(3, Complex.pow(c, 2));

  try {
    const imageData = ctx.getImageData(0, 0, DIMENSIONS.w, DIMENSIONS.w);

    for (
      let i = 0, pixelCount = 0;
      i < imageData.data.length;
      i += 4, pixelCount++
    ) {
      const col = (pixelCount % DIMENSIONS.h) - DIMENSIONS.w / 2;
      const row = Math.floor(pixelCount / DIMENSIONS.h) - DIMENSIONS.h / 2;

      const c = Complex.scalarMul(1 / SCALE, Complex(col, row));

      const [r, g, b, a] = getRootColor(c, { fn, dfn });

      imageData.data[i] = r;
      imageData.data[i + 1] = g;
      imageData.data[i + 2] = b;
      imageData.data[i + 3] = 255*clamp(0, 1, a);
    }

    ctx.putImageData(imageData, 0, 0);
  } catch (e) {
    console.error(e);
  }
};

init();
