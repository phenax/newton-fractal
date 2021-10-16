import * as C from './complex'

const one = C.make(1, 0)

export const sin = { fn: C.sin, dfn: C.cos, a: one };

export const cos = { fn: C.cos, dfn: C.sin, a: one };

export const x3_1_1 = {
  fn: z => C.minus(C.pow(z, 3), C.make(1, 0)),
  dfn: z => C.scalarMul(3, C.pow(z, 2)),
  a: C.make(1, 0)
}

export const x1_1_2 = {
  fn: z => C.minus(C.pow(z, 3), C.make(1, 0)),
  dfn: z => C.scalarMul(3, C.pow(z, 2)),
  a: C.make(2, 0)
}

export const x5_1 = {
  fn: z => C.minus(C.pow(z, 5), one),
  dfn: z => C.scalarMul(5, C.pow(z, 4)),
  a: one,
}

export const x5_x3_1 = {
  fn: z => C.minus(C.add(C.pow(z, 5), C.pow(z, 3)), one),
  dfn: z => C.add(C.scalarMul(5, C.pow(z, 4)), C.scalarMul(3, C.pow(z, 2))),
  a: one,
}

