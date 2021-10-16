import { minBy } from "ramda";

const SCALE = 100;
const ITERATIONS = 5;

// const clamp = (max, min, n) => Math.min(Math.max(n, max), min);

const Complex = (re, im) => ({ re, im });
Complex.add = (a, b) => Complex(a.re + b.re, a.im + b.im);
Complex.minus = (a, b) => Complex(a.re - b.re, a.im - b.im);
Complex.scalarMul = (n, c) => Complex(c.re * n, c.im * n);

Complex.mul = (a, b) =>
  Complex(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
Complex.div = (a, b) => {
  const mul = 1 / (b.re ** 2 - b.im ** 2)
  const c = Complex.mul(a, Complex(b.re, -b.im))
  return Complex.scalarMul(mul, c)
};
Complex.magnitude = (c) => Math.sqrt(c.re ** 2 + c.im ** 2)
Complex.distance = (a, b) => Complex.magnitude(Complex.minus(a, b))
Complex.pow = (c, n) => n === 1 ? c : Complex.mul(c, Complex.pow(c, n - 1))

const getRootColor = ({ fn, dfn, roots }, c) => {
  let z = c;
  for (let i = 0; i < ITERATIONS; i++) {
    // Z' = Z - P(Z)/P'(Z)
    const step = Complex.div(fn(z), dfn(z));
    z = Complex.minus(z, step);
  }

  const closestRoot = roots.reduce(
    minBy(({ c }) => Complex.distance(c, z))
  );

  return closestRoot.color;
};

const init = () => {
  const dimensions = { w: 900, h: 900 };
  const $canvas = document.createElement("canvas");
  document.body.appendChild($canvas);
  $canvas.width = dimensions.w;
  $canvas.height = dimensions.h;
  $canvas.style.border = "1px solid red";

  const ctx = $canvas.getContext("2d");

  const fn = (c) =>
    Complex.minus(Complex.pow(c, 3), Complex(1, 0));
  const dfn = (c) => Complex.mul(Complex.pow(c, 2), Complex(3, 0));

  const roots = [
    { color: [150, 0, 0], c: Complex(1, 0) },
    { color: [0, 150, 0], c: Complex(-0.5, Math.sqrt(3) / 2) },
    { color: [0, 0, 150], c: Complex(-0.5, -Math.sqrt(3) / 2) },
  ];

  try {
    const imageData = ctx.getImageData(0, 0, dimensions.w, dimensions.w);

    for (
      let i = 0, pixelCount = 0;
      i < imageData.data.length;
      i += 4, pixelCount++
    ) {
      const row = pixelCount / dimensions.w;
      const col = pixelCount % dimensions.w;

      const c = Complex.scalarMul(
        1 / SCALE,
        Complex(col - dimensions.w / 2, row - dimensions.h / 2)
      );

      const [r, g, b] = getRootColor({ fn, dfn, roots }, c);

      imageData.data[i] = r;
      imageData.data[i + 1] = g;
      imageData.data[i + 2] = b;
      imageData.data[i + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
  } catch (e) {
    console.error(e);
  }

  roots.forEach(({ c }) => {
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(
      c.re * SCALE + dimensions.w / 2,
      c.im * SCALE + dimensions.h / 2,
      5,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });
};

init();
