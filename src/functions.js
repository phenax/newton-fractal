import * as C from "./complex";

const one = C.make(1, 0);

export const sin = { fn: C.sin, dfn: C.cos };

export const cos = { fn: C.cos, dfn: C.sin, zero: 1 };

export const x3_1_1 = {
  //fn: z => C.minus(C.pow(z, 3), C.make(1, 0)),
  fn: (z) => C.minus(C.mul(z, C.mul(z, z)), C.make(1, 0)),
  dfn: (z) => C.scalarMul(3, C.mul(z, z)),
  a: C.make(1, 0),
};

export const x3_1_2 = {
  ...x3_1_1,
  a: C.make(2, 0),
  zero: 0.5,
};

export const x5_1 = {
  fn: (z) => C.minus(C.pow(z, 5), one),
  dfn: (z) => C.scalarMul(5, C.pow(z, 4)),
};

export const x5_x3_1 = {
  fn: (z) => C.minus(C.add(C.pow(z, 5), C.pow(z, 3)), one),
  dfn: (z) => C.add(C.scalarMul(5, C.pow(z, 4)), C.scalarMul(3, C.pow(z, 2))),
};
