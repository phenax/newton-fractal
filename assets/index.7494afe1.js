import{G as m}from"./vendor.39fd84d0.js";const x=function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function c(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerpolicy&&(o.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?o.credentials="include":t.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(t){if(t.ep)return;t.ep=!0;const o=c(t);fetch(t.href,o)}};x();const z=`#define MAX_ITERATIONS 200

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
`;const i=(e,n={},c=[])=>{const r=Object.assign(document.createElement(e),n);return c.forEach(t=>r.appendChild(t)),r},v=e=>document.createTextNode(e),u=[{name:"z^3 - 2z + 2",id:4},{name:"z^5 + 2z^3 - 1",id:0},{name:"sin(z)",id:1},{name:"cos(z)",id:2},{name:"z^3 - 1",id:3}],s=i("canvas",{style:"border: 1px solid pink"}),y=i("div",{className:"root"},[s,i("div",{className:"options"},[i("div",{},[v("Select equation:")]),i("select",{onchange:e=>d(e.target.value)},u.map(({name:e,id:n})=>i("option",{value:n},[v(e)])))])]);document.body.appendChild(y);const f=()=>{const e=Math.min(window.innerWidth,window.innerHeight);Object.assign(s,{width:e,height:e})};f();window.onresize=f;const l=new m(s);l.load(z);const h=(e,n)=>l.setUniform("a",e,n),d=e=>l.setUniform("function_type",parseInt(e,10));d(u[0].id);const p=(e=!0,n=-50)=>{const c=Math.max(-.1,Math.min(3,n/500));n=e?n+1:n-1,n===1500?e=!1:n===-50&&(e=!0),h(c,0),window.requestAnimationFrame(p.bind(null,e,n))};p();
