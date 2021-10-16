export const make = (re, im) => ({ re, im });

export const add = (a, b) => make(a.re + b.re, a.im + b.im);
export const minus = (a, b) => make(a.re - b.re, a.im - b.im);

export const scalarMul = (n, c) => make(c.re * n, c.im * n);

export const mul = (a, b) =>
  make(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);

export const div = (a, b) => {
  const x = 1 / (b.re ** 2 + b.im ** 2);
  return scalarMul(x, mul(a, make(b.re, -b.im)));
};
export const pow = (c, n) => (n <= 1 ? c : mul(c, pow(c, n - 1)));

export const magnitude = (c) => Math.sqrt(c.re ** 2 + c.im ** 2);
export const distance = (a, b) => magnitude(minus(a, b));

export const sin = (c) =>
  make(Math.sin(c.re) * Math.cosh(c.im), Math.cos(c.re) * Math.sinh(c.im));

export const cos = (c) =>
  make(Math.cos(c.re) * Math.cosh(c.im), Math.sin(c.re) * Math.sinh(c.im));
