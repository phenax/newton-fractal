#define MAX_ITERATIONS 200

precision mediump float;

uniform vec2 u_resolution;

// values
uniform vec2 a;
uniform float function_type;

float fabs(float a) { return a > 0. ? a : -a; }

float cosh(float val) {
  float tmp = exp(val);
  float cosH = (tmp + 1.0 / tmp) / 2.0;
  return cosH;
}

float sinh(float val) {
  float tmp = exp(val);
  float sinH = (tmp - 1.0 / tmp) / 2.0;
  return sinH;
}

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

vec2 cexp(vec2 z) {
  // exp(x + iy) = exp(x)*exp(iy) = exp(x)(cos(y) + isin(y))
  return exp(z.x) * vec2(cos(z.y), sin(z.y));
}

vec2 get_step(vec2 z) {
  vec2 value, derivative;

  if (function_type == 0.) { // x^5 + 2x^3 - 1
    value = cpow(z, 5) + 2.0*cpow(z, 3) - vec2(1., 0.);
    derivative = 5.0*cpow(z, 4) + 3.0*cpow(z, 2);
  } else if (function_type == 1.) { // sin(x)
    value = vec2(sin(z.x)*cosh(z.y), cos(z.x)*sinh(z.y));
    derivative = vec2(cos(z.x)*cosh(z.y), sin(z.x)*sinh(z.y));
  } else if (function_type == 2.) { // cos(x)
    value = vec2(cos(z.x)*cosh(z.y), sin(z.x)*sinh(z.y));
    derivative = vec2(sin(z.x)*cosh(z.y), cos(z.x)*sinh(z.y));
  } else if (function_type == 3.) { // x^3 - 1
    value = cpow(z, 3) - vec2(1., 0.);
    derivative = 3.0*cpow(z, 2);
  } else if (function_type == 4.) { // x^3 - 2x + 2
    value = cpow(z, 3) - 2.*z + vec2(1., 0.);
    derivative = 3.0*cpow(z, 2) - 2.;
  } else {
    value = cexp(z);
    derivative = cexp(z);
  }

  return cdiv(value, derivative);
}

void main() {
  // Normalized pixel coordinates (from 0 to 1)
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 xy = (uv - vec2(0.5, 0.5))*3.0;

  vec2 prevZ;
  vec2 z = xy;

  int iterations = 0;
  for (int i = 0; i < MAX_ITERATIONS; i++) {
    prevZ = z;
    z = prevZ - cmul(a, get_step(prevZ));

    iterations++;
    if (fabs(z.x - prevZ.x) < 0.001) break;
  }

  float val = float(iterations) * 10.0 / float(MAX_ITERATIONS);
  float g = val * 0.5;
  float b = val * 0.8;

  gl_FragColor = vec4(0.0, g, b, val);
}
