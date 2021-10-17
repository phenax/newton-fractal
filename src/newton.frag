#define MAX_ITERATIONS 200

precision mediump float;
varying vec2 _pos;

uniform vec2 u_resolution;

// values
uniform vec2 a;

float fabs(float a) { return a > 0. ? a : -a; }

vec2 cmul(vec2 a, vec2 b) {
  return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x);
}

vec2 cdiv(vec2 a, vec2 b) {
  float denominator = b.x*b.x + b.y*b.y;
  if (denominator == 0.) return a;
  return cmul(a, vec2(b.x, -b.y)) / denominator;
}

vec2 cpow(vec2 z, int n) {
  vec2 res = z;
  for (int i = 0; i < 20; i++) {
    if (i >= n - 1) break;
    res = cmul(z, res);
  }
  return res;
}

//vec2 fn(vec2 z) { return cpow(z, 3) - vec2(1., 0.); }
//vec2 dfn(vec2 z) { return 3.0*cpow(z, 2); }

vec2 fn(vec2 z) { return cpow(z, 5) + 2.0*cpow(z, 3) - vec2(1., 0.); }
vec2 dfn(vec2 z) { return 5.0*cpow(z, 4) + 3.0*cpow(z, 2); }

void main() {
  // Normalized pixel coordinates (from 0 to 1)
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 xy = (uv - vec2(0.5, 0.5))*3.0;

  vec2 prevZ;
  vec2 z = xy;

  int iterations = 0;
  for (int i = 0; i < MAX_ITERATIONS; i++) {
    prevZ = z;
    z = prevZ - cmul(a, cdiv(fn(prevZ), dfn(prevZ)));

    iterations++;
    if (fabs(z.x - prevZ.x) < 0.001) break;
  }

  float val = float(iterations) * 10.0 / float(MAX_ITERATIONS);
  float g = val * 0.5;
  float b = val * 0.8;

  gl_FragColor = vec4(0.0, g, b, val);
}
